export default function ContactPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Have questions or want to collaborate? Feel free to reach out!
      </p>
      <div className="bg-muted p-8 rounded-lg">
        <p className="text-xl font-semibold">Email us at: <span className="font-normal">hello@sebdoesmedia.com</span></p>
      </div>
    </main>
  );
}