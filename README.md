# Data Analyzer Frontend

A modern web application built with Next.js for comprehensive data analysis, visualization, and AI-powered insights. This frontend application provides an intuitive interface for users to interact with their data through summarization, visualization, and AI chat capabilities.

## Features

- **Data Summarization**: Generate concise summaries of complex datasets
- **Data Visualization**: Create interactive and dynamic visual representations of data
- **AI Chat Interface**: Interact with your data through natural language conversations
- **Modern and Responsive UI**: Built with Next.js and modern UI components

## Project Overview

The Data Analyzer Frontend is designed to provide users with three main functionalities:

1. **Data Summarization** (`/summarize`)
   - Generate comprehensive summaries of the uploaded data
   - Export summaries in various formats
   - View Data analysis suggestions
   - Save summary data

2. **Data Visualization** (`/visualize`)
   - Create interactive charts and graphs
   - Important columns Plots
   - Save visualization plots

3. **AI Chat Interface** (`/chat`)
   - Natural language interaction with data
   - Ask questions about your datasets
   - Get insights and recommendations

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd frontend-next
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key
# Add other environment variables as needed
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact [support-email] or open an issue in the repository.
