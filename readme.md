## Running the Project

This project requires Node.js and npm installed.

**1. Install Dependencies:**

Navigate to the project's root directory in your terminal and run:
```
bash
npm install
```
**2. Environment Variables:**

Based on the project files, you might need to set up environment variables. Create a `.env` file in the root of your project and add any necessary variables. Common variables for Next.js projects like this could include API keys, database URLs, etc. Refer to the project's documentation (like `docs/blueprint.md`) or code for specific required variables.
```
# Example .env file (replace with your actual variables)
NEXT_PUBLIC_API_KEY=your_api_key
DATABASE_URL=your_database_url
```
**3. Start the Development Server:**

To start the development server, run:
```
bash
npm run dev
```
This will typically start the application on `http://localhost:3000`. The specific port might be configured in `next.config.ts`.

**Additional Notes:**

*   The `src/ai` directory suggests there might be AI-related configurations or setup required. Refer to any documentation within that directory or the `docs/blueprint.md` for details.
*   The presence of `components.json` might indicate a UI component library setup.
*   `src/ai/dev.ts` and `src/ai/genkit.ts` suggest the use of Genkit for AI flows. You might need to configure Genkit separately.