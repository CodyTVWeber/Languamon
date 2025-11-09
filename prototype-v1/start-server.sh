#!/bin/bash
# Quick start script for Linguomon prototype

echo "🎮 Starting Linguomon Prototype v1..."
echo ""
echo "Choose your server:"
echo "1) Python 3 (recommended)"
echo "2) Python 2"
echo "3) PHP"
echo "4) Just open in browser"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "Starting Python 3 server on http://localhost:8000"
        python3 -m http.server 8000
        ;;
    2)
        echo "Starting Python 2 server on http://localhost:8000"
        python -m SimpleHTTPServer 8000
        ;;
    3)
        echo "Starting PHP server on http://localhost:8000"
        php -S localhost:8000
        ;;
    4)
        echo "Opening index.html in browser..."
        if command -v xdg-open > /dev/null; then
            xdg-open index.html
        elif command -v open > /dev/null; then
            open index.html
        else
            echo "Please open index.html manually in your browser"
        fi
        ;;
    *)
        echo "Invalid choice. Opening in browser..."
        if command -v xdg-open > /dev/null; then
            xdg-open index.html
        elif command -v open > /dev/null; then
            open index.html
        else
            echo "Please open index.html manually in your browser"
        fi
        ;;
esac
