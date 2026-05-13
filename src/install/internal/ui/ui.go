package ui

import (
	"fmt"
	"os"
	"time"

	"charm.land/bubbles/v2/spinner"
	"charm.land/bubbles/v2/textinput"
	"charm.land/bubbletea/v2"
	"charm.land/lipgloss/v2"
	"github.com/charmbracelet/x/term"

	"github.com/sandboxnu/sarge/internal/command"
)

const SARGE_ASCII = `
 ███████╗ █████╗ ██████╗  ██████╗ ███████╗
 ██╔════╝██╔══██╗██╔══██╗██╔════╝ ██╔════╝
 ███████╗███████║██████╔╝██║  ███╗█████╗
 ╚════██║██╔══██║██╔══██╗██║   ██║██╔══╝
 ███████║██║  ██║██║  ██║╚██████╔╝███████╗
 ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
`

const SARGE_PRIMARY_700 = "#4125dc"
const SARGE_SUCCESS_800 = "#00592e"
const SARGE_ERROR_700 = "#b42318"

var (
	detectedOS   string
	detectedArch string
)

// Go's way of defining enum values. Think of this as enum Step {...}
type step int

const (
	system step = iota
	permission
	dependencies
	hostname
	bootstrap
	complete
)

type task struct {
	step         step
	runningStr   string
	completedStr string
	run          func() error
	startedAt    time.Time
	elapsed      time.Duration
}

type taskDoneMsg struct {
	step    step
	err     error
	elapsed time.Duration
}

type model struct {
	step              step
	tasks             []task
	spinner           spinner.Model
	hostnameInput     textinput.Model
	hostnameSubmitted bool
	hostname          string
	setupComplete     bool
	errMessage        string
}

func InitialModel() model {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(lipgloss.Color(SARGE_PRIMARY_700))

	ti := textinput.New()
	ti.Placeholder = "sargenu.dev"
	ti.Prompt = ""
	ti.SetVirtualCursor(false)
	ti.Focus()
	ti.SetWidth(20)

	m := model{
		// NOTE(laith): initial step defined here
		step: system,
		tasks: []task{
			{step: system, runningStr: "Checking system requirements", completedStr: "System requirements pass", run: func() error { return command.CheckSystemRequirements() }},
			{step: permission, runningStr: "Checking root permissions", completedStr: "Verified root permissions", run: func() error { return command.CheckPermission() }},
			{step: dependencies, runningStr: "Installing dependencies", completedStr: "Dependencies successfully installed", run: func() error { return command.InstallDependencies() }},
			// NOTE(laith): these values are dynamic so we only define the step right now
			{step: hostname, runningStr: "Input your hostname:", run: fakeWork(2000 * time.Millisecond)},
			{step: bootstrap, runningStr: "Bootstrapping Sarge", completedStr: "Sarge successfully bootstrapped", run: fakeWork(2000 * time.Millisecond)},
			// NOTE(laith): this has a different display entirely
			{step: complete},
		},
		spinner:       s,
		hostnameInput: ti,
		errMessage:    "",
	}
	// NOTE(laith): stamp the first task's start time so the live timer is accurate from frame one.
	m.tasks[0].startedAt = time.Now()
	return m
}

func fakeWork(d time.Duration) func() error {
	return func() error {
		time.Sleep(d)
		return nil
	}
}

// Defining a function that can be used in tea.Batch
func runTask(task task) tea.Cmd {
	return func() tea.Msg {
		start := time.Now()
		err := task.run()
		return taskDoneMsg{step: task.step, err: err, elapsed: time.Since(start)}
	}
}

// Init is ran at the beginning of the program, with that, we want to start the first step
func (m model) Init() tea.Cmd {
	return tea.Batch(m.spinner.Tick, runTask(m.tasks[0]))
}

// Update reads the message, and returns the state model, and the next command that needs to be ran
// The state model will then be used to update anything that needs to be rendered
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	case tea.KeyPressMsg:
		if m.step == hostname {
			switch msg.String() {
			case "ctrl+c":
				return m, tea.Quit
			case "enter":
				hostname := m.hostnameInput.Value()
				if hostname == "" {
					// NOTE(laith): this continues to show the same frame, so it is ignoring the input here
					return m, nil
				}

				m.tasks[m.step].run = func() error { return command.BootstrapCaddy(hostname) }
				m.tasks[m.step].runningStr = fmt.Sprintf("Generating SSL certificates for %s", hostname)
				m.tasks[m.step].completedStr = fmt.Sprintf("SSL certificates successfully generated for %s", hostname)
				m.tasks[m.step].startedAt = time.Now()
				m.hostname = hostname
				m.hostnameSubmitted = true
				return m, runTask(m.tasks[m.step])
			}
			var cmd tea.Cmd
			m.hostnameInput, cmd = m.hostnameInput.Update(msg)
			return m, cmd
		}

		switch msg.String() {
		case "q", "ctrl+c", "esc":
			return m, tea.Quit
		}
		return m, nil

	case taskDoneMsg:
		if msg.err != nil {
			m.errMessage = msg.err.Error()
			return m, nil
		}

		m.tasks[msg.step].elapsed = msg.elapsed

		if int(msg.step)+1 >= len(m.tasks) {
			return m, tea.Quit
		}

		m.step = m.tasks[msg.step+1].step

		if m.step == hostname {
			return m, nil
		}

		if m.step == complete {
			m.setupComplete = true
			return m, nil
		}

		m.tasks[msg.step+1].startedAt = time.Now()
		return m, runTask(m.tasks[msg.step+1])

	// Spinner sends its own message in the Init function via the batch
	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	}

	return m, nil
}

// Update simply draws the model at its given state. For each step we are rendering a new set of
// content. Content is just a string
func (m model) View() tea.View {
	width, height, _ := term.GetSize(os.Stdout.Fd())

	bannerStyle := lipgloss.NewStyle().Foreground(lipgloss.Color(SARGE_PRIMARY_700)).Bold(true)
	checkStyle := lipgloss.NewStyle().Foreground(lipgloss.Color(SARGE_SUCCESS_800))
	timeStyle := lipgloss.NewStyle().Faint(true)

	var stepLines []string
	for _, t := range m.tasks {
		switch {
		case t.step < m.step:
			stepLines = append(stepLines, fmt.Sprintf("%s %s %s",
				checkStyle.Render("✓"),
				t.completedStr,
				timeStyle.Render(fmt.Sprintf("(%s)", t.elapsed.Round(time.Second))),
			))
		case t.step == m.step:
			if t.step == hostname && !m.hostnameSubmitted {
				// NOTE(laith): unfortunately text input's API needs it to be styled within view
				// and cannot be styled beforehand like spinner in initialModel()
				inputBox := lipgloss.NewStyle().
					Border(lipgloss.RoundedBorder()).
					BorderForeground(lipgloss.Color(SARGE_PRIMARY_700)).
					Padding(0, 1).
					Render(m.hostnameInput.View())
				stepLines = append(stepLines, fmt.Sprintf("%s\n%s", t.runningStr, inputBox))
			} else {
				stepLines = append(stepLines, fmt.Sprintf("%s %s %s",
					m.spinner.View(),
					t.runningStr,
					timeStyle.Render(fmt.Sprintf("(%s)", time.Since(t.startedAt).Round(time.Second))),
				))
			}
		}
	}

	banner := bannerStyle.Render(SARGE_ASCII)

	var quit string
	if m.step == hostname {
		quit = lipgloss.NewStyle().Faint(true).Render("press ctrl + c to quit")
	} else {
		quit = lipgloss.NewStyle().Faint(true).Render("press q, esc, or ctrl + c to quit")
	}

	bannerH := lipgloss.Height(banner)
	footerH := 3
	mainH := height - bannerH - footerH

	header := lipgloss.Place(width, bannerH, lipgloss.Center, lipgloss.Top, banner)

	var main string
	var steps string
	if m.setupComplete {
		steps = fmt.Sprintf("Sarge installation complete!\nYou can start using Sarge now by visiting:\n\nhttps://%s\n\nSarge will automatically install updates at 2:00 AM each day.\nRun the `sarge` command to view your administrator options.", m.hostname)
		main = lipgloss.Place(width, mainH, lipgloss.Center, lipgloss.Center, steps)
	} else {
		steps = lipgloss.JoinVertical(lipgloss.Center, stepLines...)
		main = lipgloss.Place(width, mainH, lipgloss.Center, lipgloss.Center, steps)
	}

	if m.errMessage != "" {
		stepsStyle := lipgloss.NewStyle().Foreground(lipgloss.Color(SARGE_ERROR_700)).Bold(true)
		steps = stepsStyle.Render(fmt.Sprintf("Error: %s", m.errMessage))
	}

	footer := lipgloss.Place(width, footerH, lipgloss.Center, lipgloss.Top, quit)

	v := tea.NewView(lipgloss.JoinVertical(lipgloss.Left, header, main, footer))
	v.AltScreen = true
	return v
}
