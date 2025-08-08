const notFound = () => {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <div className="flex flex-col items-center justify-center">
        <h1>404 - Page Not Found⛓️‍💥</h1>
        <p>The page you requested does not exist.</p>
      </div>
    </main>
  );
};

export default notFound;
