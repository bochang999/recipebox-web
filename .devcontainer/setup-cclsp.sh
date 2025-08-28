#!/bin/bash

# RecipeBox CCLSP Environment Auto-Setup Script
echo "🚀 Setting up CCLSP environment..."

# Install dependencies
npm install
npm install -g cclsp typescript-language-server

# Create Claude Code MCP configuration
mkdir -p ~/.config/claude-code
cat > ~/.config/claude-code/config.json << 'EOF'
{
  "mcpServers": {
    "cclsp": {
      "type": "stdio",
      "command": "cclsp",
      "env": {
        "CCLSP_CONFIG_PATH": "./cclsp.json"
      }
    }
  }
}
EOF

# Test CCLSP installation
echo "🔍 Testing CCLSP installation..."
cclsp --version

echo "✅ CCLSP environment setup completed!"
echo "🎯 Ready to use find_definition, find_references, and other MCP tools"

# Start development server
echo "🌐 Starting development server..."
npx http-server . -p 8080 -c-1