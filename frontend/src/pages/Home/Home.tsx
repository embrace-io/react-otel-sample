import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();
      } catch (e) {
        console.error(e);
      }
    };

    pingServer();
  }, []);

  return <div>Home</div>;
};

export default Home;
