<a href="https://sarge-nu.vercel.app/"><p align="center">
<img height=200 src="https://raw.githubusercontent.com/sandboxnu/sarge/main/.assets/HelmetLogoFull.png"/>

</p></a>
<p align="center">
  <strong>System for Automated Recruitment, Grading, and Evaluation 🪖</strong>
</p>

<h3 align="center">
  <a href="https://www.sandboxnu.com/">Sandbox</a>
  <span> · </span>
  <a href="https://www.nunext.dev/">NExT Consulting</a>
</h3>

---

## Getting Started

### Hosting

Sarge is self-hostable! The **minimum** system requirements are as follows:

- **Operating System**: Linux
- **CPU**: 1 vCPU
- **RAM**: 1 GB
- **Storage**: 10 GB

Install using:

```sh
curl -fsSL https://raw.githubusercontent.com/sandboxnu/sarge/main/src/install/install.sh | sudo sh
```

Release versioning is attached to our installation script, TUI, and CLI. Sarge Web and WS images are rolling release. You can update your Sarge version by restarting Sarge as root:

```sh
cd /opt/sarge && docker compose pull && docker compose up -d
```

Environment variables can be edited in `/opt/sarge/.env`.

### Contributing

#### Requirements:

- [Node](https://nodejs.org/en/download)
- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/desktop/)

Run the commands in the following order

1. Clone the repository

```sh
git clone https://github.com/sandboxnu/sarge.git
cd sarge/
```

2. Install project dependencies

```sh
pnpm install
cd src/ws && pnpm install
```

3. Setup the .env file

```
# in the project's root directory
mv .env.example .env
```

> [!NOTE]
> You must contact Sarge project leadership to retrieve project environment variables

4. Run the application

```sh
# with docker desktop open
./start.sh
```

Sarge Web will be available on http://localhost:3000/

Sarge WS will be available on ws://localhost:8080/
