# PaperBank 📚

**A webapp to manage and streamline your research papers.**

Check it out at [PaperBank](https://paper-bank.com)

---

## Features ✨

- **Direct Import:** Search for papers via the arXiv API and import them with one click.
- **Semantic Search:** Efficiently search through papers and notes using semantic search.
- **User Authentication:** Secure login and management using Clerk.

## Motivation 💡

While working on various projects, I found it cumbersome to keep track of numerous research papers. Initially, I used a Notion page with a table to store links to papers, but the workflow was inefficient and prone to errors. Copying and pasting titles, links, and other metadata manually was time-consuming. PaperBank solves this problem by allowing users to directly search for papers via the arXiv API and import them with one click. Additionally, it features semantic search capabilities that enhance the workflow by allowing you to search through the notes you add to your papers.

## Getting Started 🚀

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v14.17.0 or later)
- npm (v6 or later) or yarn or pnpm or bun
- Convex CLI
- Clerk CLI

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/paperbank.git
    cd paperbank
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Set up Convex and Clerk following their documentation:

    - [Convex Documentation](https://docs.convex.dev)
    - [Clerk Documentation](https://clerk.dev/docs)

### Running the Development Server

To start the development server, run:

```bash
npx convex dev &
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## Learn More 📚

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Convex Documentation](https://docs.convex.dev) - Learn about using Convex for backend functions.
- [Clerk Documentation](https://clerk.dev/docs) - Learn about implementing authentication with Clerk.
- [arXiv API Documentation](https://arxiv.org/help/api) - Learn about accessing research papers via the arXiv API.

## Future Plans 🔮

- **Tags:** Although semantic search is powerful, adding tags could improve organization.
- **Recommender System:** Implement a system to recommend papers based on user preferences and reading history.

## Contributing 🤝

Contributions are welcome! Please report issues or submit pull requests.

## License ⚖️

This project is licensed under the MIT License.
