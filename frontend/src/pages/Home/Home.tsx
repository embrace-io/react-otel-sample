import { useEffect, useState } from "react";
import ProductsList from "./components/ProductsList/ProductsList";

import styles from "./Home.module.css";
import Container from "../../components/Container/Container";

type Product = {
  id: number;
  name: string;
  price: number;
  short_description: string;
  description: string;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();

        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return <div>Loading</div>;
  }

  return (
    <Container>
      <h1 className={styles.title}>
        The <span className={styles.highlight}>OpenTelemetry</span> Store
      </h1>
      <ProductsList products={products} />
    </Container>
  );
};

export default Home;
export type { Product };
