<a href="https://sarge-nu.vercel.app/"><p align="center">
<img height=100 src="https://raw.githubusercontent.com/sandboxnu/sarge/main/.assets/HelmetLogoFull.png"/>

</p></a>
<p align="center">
  <strong>System for Automated Recruitment Grading and Evaluation 🪖</strong>
</p>

<h3 align="center">
  <a href="https://www.sandboxnu.com/">Sandbox</a>
  <span> · </span>
  <a href="https://www.nunext.dev/">NExT Consulting</a>
</h3>

---

## Requirements:

- [Node](https://nodejs.org/en/download)
- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/desktop/)

## Getting Started

Run the commands in the following order

1. Clone the repository

```sh
git clone https://github.com/sandboxnu/sarge.git
cd sarge/
```

2. Install project dependencies

```sh
pnpm install
```

3. Setup the .env file

```
mv .env.example .env
```

> [!NOTE]
> You must contact Sarge project leadership to retrieve project environment variables

4. Run the application

```sh
# with docker desktop open
./start.sh
```
Sarge will be available on http://localhost:3000/
