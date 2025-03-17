# DnD Wiki Frontend

## Project Overview

This is a Proof of Concept (PoC) for a world-building tool designed to assist in managing locations, NPCs, and story elements for Dungeons & Dragons campaigns. The objective was to explore how web technologies can streamline the creative process and enhance campaign management. Ideally, this tool would provide a centralized hub for Dungeon Masters to organize and track campaign details, making it easier to manage and share information with players. My goal is to create an open source tool that other DMs can use and contribute to.

## Features

- **World Building:** Tools for organizing locations, lore, and world details.
- **NPC & Character Management:** Track and store details about NPCs and player characters.
- **Quest Tracking:** Maintain a structured log of quests, objectives, and progress.
- **Data Organization:** Structured storage for campaign information, making it easy to retrieve and update details.

## Technology Stack

- **Frontend:** React, TypeScript, Remix, ShadCN UI, Tailwind CSS, Zod
- **Backend:** Directus CMS (chosen for its easy local deployment without cloud setup)

## Installation & Setup

### Prerequisites

- This project uses node v22.13.0. If you encounter any issues, ensure you have the correct version installed.
- You will need to set up the the backend server as well. You can find the backend repository [here](...) (This link will be updated once the backend repository is created).

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/world-builder-poc.git
   ```
2. Navigate to the project directory:
   ```sh
   cd dnd-wiki-remix-fe
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5174`

## Findings & Next Steps

### Findings

- Web tools are effective for structuring campaign details but require intuitive UI/UX for smooth navigation.
- NPC and quest tracking features were helpful but could benefit from automation and filtering options.
- No performance issues arose due to rapid development. However, further testing is needed for scalability.
- Remix and Tailwind CSS were effective for rapid prototyping and styling.
- Directus CMS was a convenient choice for local development without requiring a cloud-based backend. However, it may not be suitable for production use due to cost. I will like to explore other free alternatives.

### Next Steps

- **Code Refactor:** Improve structure and organization.
- **Feature Expansion:** Add more customization options for NPCs and locations.
- **UI/UX Enhancements:** Improve navigation and accessibility.
- **Backend Integration:** Connect to a more scalable backend solution. For now I will explore on how to import/export data structure from Directus.
- **Deployment:** Set up a hosted version for easy access.

## Limitations

- **PoC Nature:** Built quickly to test feasibility, so some code may need refactoring.
- **Design Limitations:** UI/UX may not be fully optimized.
- **Limited Features:** Focused on core ideas rather than full-fledged functionality.
- **Performance Considerations:** Some inefficiencies due to rapid prototyping.

## Contributing & Feedback

This project is a PoC, but feedback and ideas for improvement are welcome. If you'd like to contribute or discuss enhancements, feel free to reach out.

## License

[GNU GENERAL PUBLIC LICENSE](LICENSE)
