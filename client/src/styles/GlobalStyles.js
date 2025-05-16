import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #2C5282;
    --primary-light: #3182CE;
    --primary-dark: #1A365D;
    --secondary:rgb(56, 121, 161);
    --secondary-light:rgb(121, 185, 203);
    --secondary-dark:rgb(36, 125, 135);
    --accent: #E53E3E;
    --accent-light: #F56565;
    --accent-dark: #C53030;
    --neutral-dark: #2D3748;
    --neutral-light: #F7FAFC;
    --gray: #718096;
    --gray-light: #A0AEC0;
    --gray-dark: #4A5568;
    --success: #38A169;
    --warning: #ECC94B;
    --danger: #E53E3E;
    --info: #4299E1;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --radius: 4px;
    --radius-lg: 8px;
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    background-color: var(--neutral-light);
    color: var(--neutral-dark);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--neutral-dark);
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  h4 {
    font-size: 1.5rem;
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    transition: var(--transition);
    
    &:hover {
      color: var(--primary-light);
    }
  }

  button, .button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    font-weight: 500;
    transition: var(--transition);
    border: none;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input, select, textarea {
    padding: 0.5rem;
    border: 1px solid var(--gray-light);
    border-radius: var(--radius);
    font-size: 1rem;
    width: 100%;
    margin-bottom: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--gray-light);
    }
    
    th {
      background-color: var(--neutral-light);
      font-weight: 600;
    }
    
    tr:hover {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    
    &-primary {
      background-color: var(--primary);
      color: white;
      
      &:hover {
        background-color: var(--primary-light);
      }
    }
    
    &-secondary {
      background-color: var(--secondary);
      color: white;
      
      &:hover {
        background-color: var(--secondary-light);
      }
    }
    
    &-accent {
      background-color: var(--accent);
      color: white;
      
      &:hover {
        background-color: var(--accent-light);
      }
    }
    
    &-outline {
      background-color: transparent;
      border: 1px solid var(--primary);
      color: var(--primary);
      
      &:hover {
        background-color: var(--primary);
        color: white;
      }
    }
  }

  .text-center {
    text-align: center;
  }

  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mt-3 { margin-top: 1rem; }
  .mt-4 { margin-top: 1.5rem; }
  .mt-5 { margin-top: 2rem; }

  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 1rem; }
  .mb-4 { margin-bottom: 1.5rem; }
  .mb-5 { margin-bottom: 2rem; }

  .ml-1 { margin-left: 0.25rem; }
  .ml-2 { margin-left: 0.5rem; }
  .ml-3 { margin-left: 1rem; }
  .ml-4 { margin-left: 1.5rem; }
  .ml-5 { margin-left: 2rem; }

  .mr-1 { margin-right: 0.25rem; }
  .mr-2 { margin-right: 0.5rem; }
  .mr-3 { margin-right: 1rem; }
  .mr-4 { margin-right: 1.5rem; }
  .mr-5 { margin-right: 2rem; }

  .p-1 { padding: 0.25rem; }
  .p-2 { padding: 0.5rem; }
  .p-3 { padding: 1rem; }
  .p-4 { padding: 1.5rem; }
  .p-5 { padding: 2rem; }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-center {
    justify-content: center;
  }

  .gap-1 { gap: 0.25rem; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 1rem; }
  .gap-4 { gap: 1.5rem; }
  .gap-5 { gap: 2rem; }

  .grid {
    display: grid;
  }

  .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

  @media (max-width: 768px) {
    .grid-cols-2, .grid-cols-3, .grid-cols-4 {
      grid-template-columns: 1fr;
    }
  }
`

export default GlobalStyle
