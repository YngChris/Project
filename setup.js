const fs = require("fs");
const path = require("path");

console.log("🚀 MedAlert API Setup");
console.log("=====================\n");

// Check if .env file exists
const envPath = path.join(__dirname, ".env");
const envExamplePath = path.join(__dirname, "env.example");

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log("📝 Creating .env file...");
  fs.copyFileSync(envExamplePath, envPath);
  console.log(
    "✅ .env file created! Please edit it with your configuration.\n"
  );
} else {
  console.log("✅ .env file already exists.\n");
}

console.log("📋 Next Steps:");
console.log("1. Edit .env file with your configuration");
console.log("2. Start MongoDB (local or Atlas)");
console.log("3. Run: npm run dev");
console.log("4. Visit: http://localhost:5000/api");
console.log("5. Visit: http://localhost:5000/health\n");

console.log("✨ Setup complete! 🎉");
