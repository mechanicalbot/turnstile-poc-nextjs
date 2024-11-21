export default async function Nested() {
  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <iframe
        src="https://turnstile-poc-nextjs.vercel.app"
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
