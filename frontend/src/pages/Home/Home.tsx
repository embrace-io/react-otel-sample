import { useEffect, useState } from "react";
import ProductsList from "./components/ProductsList/ProductsList";

import styles from "./Home.module.css";
import Container from "../../components/Container/Container";
import Page from "../../components/Page";
import useSpansContext from "../../components/SpansProvider/hooks/useSpansContext";

type Product = {
  id: number;
  name: string;
  price: number;
  short_description: string;
  description: string;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { getOrCreateSpan, withSpanContext } = useSpansContext();

  const [purchaseFlowSpan, purchaseFlowSpanCreated] =
    getOrCreateSpan("Purchase Flow");

  useEffect(() => {
    if (purchaseFlowSpanCreated) {
      purchaseFlowSpan.addEvent("Home Page Visited");
      purchaseFlowSpan.setAttribute("user_id", 123);
    }
  }, [purchaseFlowSpan, purchaseFlowSpanCreated]);

  useEffect(() => {
    withSpanContext("Page Ready", async () => {
      try {
        const response = await fetch("http://localhost:8080/products");
        const data = await response.json();

        setProducts(data);
      } catch (e) {
        console.error(e);
      }
    });
  }, [withSpanContext]);

  return (
    <Page
      instrumentation={{ pageName: "Home" }}
      isLoading={products.length === 0}
    >
      <Container>
        <h1 className={styles.title}>
          The <span className={styles.highlight}>OpenTelemetry</span> Store
        </h1>
        <ProductsList products={products} />
      </Container>
    </Page>
  );
};

export default Home;
export type { Product };
