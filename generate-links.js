// Generate invitation links for wedding guests
// Usage: node generate-links.js

const baseUrl = "http://localhost:3000" // Change to your production URL

// List of guests
const guests = [
  "លោក លី ម៉ុងស",
  "លោក និង លោកស្រី ចាន់ណារ៉ា",
  "គ្រួសារ សុខ សំណាង",
  "លោក វិចិត្រ",
  "លោកស្រី សុភា",
  "Mr. and Mrs. Smith",
  "The Johnson Family",
]

console.log("\n🎉 Wedding Invitation Links Generator\n")
console.log("=" .repeat(60))

guests.forEach((guest, index) => {
  const encodedName = encodeURIComponent(guest)
  const invitationLink = `${baseUrl}/?name=${encodedName}`
  
  console.log(`\n${index + 1}. Guest: ${guest}`)
  console.log(`   Link: ${invitationLink}`)
})

console.log("\n" + "=".repeat(60))
console.log("\n📱 Copy and share these links via:")
console.log("   • WhatsApp / Telegram")
console.log("   • Email")
console.log("   • SMS")
console.log("   • QR Code\n")

// Example QR Code generation note
console.log("💡 Tip: Use a QR code generator to create QR codes for each link")
console.log("   Recommended: https://www.qr-code-generator.com/\n")

