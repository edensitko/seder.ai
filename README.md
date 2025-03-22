<div align="center">

# 🍷 Seder.ai 🍷

### Interactive Passover Experience

[![GitHub license](https://img.shields.io/github/license/edensitko/seder.ai?style=flat-square)](https://github.com/edensitko/seder.ai/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/edensitko/seder.ai?style=flat-square)](https://github.com/edensitko/seder.ai/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/edensitko/seder.ai?style=flat-square)](https://github.com/edensitko/seder.ai/issues)
[![GitHub forks](https://img.shields.io/github/forks/edensitko/seder.ai?style=flat-square)](https://github.com/edensitko/seder.ai/network)
[![Twitter Follow](https://img.shields.io/twitter/follow/edensitko?style=social)](https://twitter.com/edensitko)

<img src="public/logo.png" alt="Seder.ai Logo" width="200"/>

*Bringing the ancient tradition of Passover into the digital age*

[Demo](https://seder.ai) • [Documentation](https://docs.seder.ai) • [Report Bug](https://github.com/edensitko/seder.ai/issues) • [Request Feature](https://github.com/edensitko/seder.ai/issues)

</div>

---

## ✨ Overview

**Seder.ai** is an innovative web application designed to enhance the Passover Seder experience through AI-powered interactions. The platform provides a modern, interactive way to engage with the traditional Passover story, making it accessible and engaging for participants of all ages and backgrounds.

<details>
<summary>📖 What is a Passover Seder?</summary>
<br>
The Passover Seder is a Jewish ritual feast that marks the beginning of the Jewish holiday of Passover. It involves retelling the story of the liberation of the Israelites from slavery in ancient Egypt, which is told through the Haggadah, a text that sets forth the order of the Seder.
</details>

## 🚀 Features

- **📚 Interactive Haggadah**: Digital version of the traditional Passover text with modern interpretations
- **🤖 AI-Powered Discussions**: Generate thoughtful questions and insights about the Passover story
- **⚙️ Customizable Experience**: Tailor the Seder experience to your family's traditions and preferences
- **🌐 Multilingual Support**: Available in multiple languages to accommodate diverse communities
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 🖥️ Demo & Screenshots

<div align="center">
<table>
  <tr>
    <td><img src="public/screenshot1.png" alt="Screenshot 1" width="400"/></td>
    <td><img src="public/screenshot2.png" alt="Screenshot 2" width="400"/></td>
  </tr>
  <tr>
    <td><img src="public/screenshot3.png" alt="Screenshot 3" width="400"/></td>
    <td><img src="public/screenshot4.png" alt="Screenshot 4" width="400"/></td>
  </tr>
</table>
</div>

## 🛠️ Technology Stack

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)

</div>

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/edensitko/seder.ai.git
   cd seder.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Docker Deployment

<details>
<summary>📋 Using the Helper Script</summary>
<br>

We've included a helper script to simplify Docker operations:

```bash
# Make the script executable (only needed once)
chmod +x docker-start.sh

# Start in development mode (with hot reloading)
./docker-start.sh dev

# Start in production mode
./docker-start.sh prod

# Build the production Docker image
./docker-start.sh build

# Stop running containers
./docker-start.sh stop
```
</details>

<details>
<summary>📋 Manual Docker Commands</summary>
<br>

If you prefer using Docker commands directly:

**Development Mode**

```bash
# Build and start the development container
docker-compose -f docker-compose.dev.yml up --build

# Stop the development container
docker-compose -f docker-compose.dev.yml down
```

**Production Mode**

```bash
# Build and start the production container
docker-compose up --build

# Stop the production container
docker-compose down
```
</details>

## 📂 Project Structure

```
seder.ai/
├── public/            # Static assets
├── src/               # Source code
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── styles/        # CSS and styling
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── docker/            # Docker configuration files
├── .env.example       # Example environment variables
├── docker-compose.yml # Production Docker Compose config
└── README.md          # Project documentation
```

## 🤝 Contributing

We welcome contributions to Seder.ai! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

<details>
<summary>📋 Contribution Guidelines</summary>
<br>

### Code Style
- Follow the existing code style
- Use meaningful variable and function names
- Write comments for complex logic

### Commit Messages
- Use clear and meaningful commit messages
- Reference issue numbers when applicable

### Testing
- Add tests for new features
- Ensure all tests pass before submitting a PR
</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/edensitkovetsky)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/edensitko)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@seder.ai)
[![Website](https://img.shields.io/badge/Website-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)](https://seder.ai)

</div>

- **Project Maintainer**: Eden Sitkovetsky
- **GitHub**: [edensitko](https://github.com/edensitko)
- **Website**: [seder.ai](https://seder.ai)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Seder.ai
- Special thanks to the Jewish community for their insights and feedback
- Inspired by the timeless tradition of the Passover Seder

---

<div align="center">

### Made with ❤️ for the Passover tradition

⭐ Star this repo if you find it useful! ⭐

</div>
