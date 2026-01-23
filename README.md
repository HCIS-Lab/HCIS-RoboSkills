<div align="center">
  <img src="public/hcis-lab-logo.svg" alt="HCIS Lab Logo" width="200" />
  <h1>HCIS Lab - RoboSkills</h1>
  <h3>Robotic Skill Visualization & Analysis Platform</h3>
  
  <p>
    An interactive, data-driven dashboard for visualizing robotic capabilities, <br />
    analyzing skill gaps, and managing expertise distribution in Human-Centered Physical AI research.
  </p>

  <br />
  <img src="public/og-image.png" alt="RoboSkills Preview" width="100%" />
  <br />

  <p>
    <a href="https://hcis-lab.github.io/HCIS-RoboSkills/">Live Demo</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="https://sites.google.com/site/yitingchen0524/">HCIS Lab</a>
  </p>

  <p>
    <em>Built using the <a href="https://github.com/whats2000/RoboSkills">RoboSkills</a> template</em>
  </p>
</div>

---

## 🚀 Overview

**RoboSkills** is a cutting-edge web application developed by the Human-centered Intelligent Systems Laboratory (HCIS Lab) at National Yang Ming Chiao Tung University. It bridges the gap between complex robotic data and actionable insights. By leveraging advanced visualization techniques—including forced-directed graphs and Venn diagrams—it provides a clear map of skill dependencies, overlaps, and critical gaps in Human-Centered Physical AI research and development.

## ✨ Key Features

- **📊 Interactive Skill Chart**
  - Visualize complex relationships with dynamic D3.js Venn diagrams.
  - Explore skill clusters using interactive force-directed graphs.
- **📉 Gap Analysis Engine**
  - Identify missing capabilities with precision.
  - Visualize expertise distribution (`Novice` to `Expert`) across different domains.

- **🎨 Modern User Interface**
  - Built with **Ant Design** and **Tailwind CSS** for a sleek, glassmorphism-inspired aesthetic.
  - Fully responsive layout ensuring a seamless experience on all devices.

## 🛠️ Tech Stack

Built with modern, high-performance technologies:

| Category       | Technology                                                                                                    | Description                         |
| :------------- | :------------------------------------------------------------------------------------------------------------ | :---------------------------------- |
| **Framework**  | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)                    | Frontend library for building UIs   |
| **Language**   | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)      | Typed superset of JavaScript        |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                        | Next Generation Frontend Tooling    |
| **Styling**    | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first CSS framework         |
| **Components** | ![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=flat&logo=ant-design&logoColor=white)      | Enterprise-class UI design language |
| **Data Viz**   | ![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=flat&logo=d3.js&logoColor=white)                     | Dynamic data visualization library  |

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/HCIS-Lab/HCIS-RoboSkills.git
    cd HCIS-RoboSkills
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Explore**
    Open `http://localhost:5173` in your browser to view the app.

## 📦 Building for Production

To generate a production-ready build:

```bash
npm run build
```

The output will be optimized and placed in the `dist` directory.

## 📄 License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.

## 👏 Acknowledgments & Third Party Licenses

This project is built from the **[RoboSkills](https://github.com/whats2000/RoboSkills)** template. We thank the original author for creating this excellent foundation.

This project also incorporates code from external libraries:

- **[d3-venn](https://github.com/christophe-g/d3-venn)** by Christophe Geiser (BSD 3-Clause License)
- **[venn.js](https://github.com/benfred/venn.js)** by Ben Frederickson (MIT License)
- **[spa-github-pages](https://github.com/rafgraph/spa-github-pages)** by Rafael Pedicini (MIT License)

## 📖 Citation

If you find RoboSkills useful in your work, please consider citing it as follows:

```bibtex
@software{roboskills2026,
  author = {whats2000},
  title = {RoboSkills: Robotic Skill Visualization \& Analysis Platform},
  year = {2026},
  url = {https://github.com/whats2000/RoboSkills},
  note = {Available at: https://whats2000.github.io/RoboSkills/}
}
```
