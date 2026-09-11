package main

import (
	"fmt"
	"os"

	"charm.land/bubbletea/v2"
	"github.com/sandboxnu/sarge/internal/ui"
)

func main() {
	p := tea.NewProgram(ui.InitialModel())
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
