import { useCallback, useEffect, useState } from "react";
import { Product } from "../Home/Home";
import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import fakeProductPicture from "../../assets/fake-product-picture.png";
import { metrics, SpanStatusCode } from "@opentelemetry/api";
import Page from "../../components/Page";

import styles from "./ProductDetails.module.css";
import useSpansContext from "../../components/SpansProvider/hooks/useSpansContext";

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = useParams();
  const { getOrCreateSpan, withSpanContext, endSpan } = useSpansContext();

  useEffect(() => {
    withSpanContext("Page Ready", async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/products/${productId}`,
        );
        const data = await response.json();

        setProduct(data);
      } catch (e) {
        console.error(e);
      }
    });
  }, [productId, withSpanContext]);

  const handleBuyClicked = useCallback(() => {
    const meter = metrics.getMeter("react-client");
    const counter = meter.createCounter("react_client_buy_button_clicked", {
      description: "Number of times the buy button was clicked",
      unit: "unit",
    });
    const [activeSpan] = getOrCreateSpan("Purchase Flow");

    activeSpan.addEvent("Buy Button Clicked", {
      "react_client.product_id": productId,
    });
    activeSpan.setStatus({ code: SpanStatusCode.OK });
    endSpan("Purchase Flow");
    counter.add(1, {
      "react_client.product_id": productId,
    });
  }, [productId, getOrCreateSpan]);

  return (
    <Page
      instrumentation={{
        pageName: "Product Details",
        attributes: { product_id: productId },
      }}
      isLoading={!product}
    >
      {product && (
        <Container>
          <h1 className={styles.title}>Product Details</h1>
          <h2 className={styles.productName}>{product.name}</h2>
          <div className={styles.product}>
            <div>
              <img
                src={fakeProductPicture}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            <div>
              <p className={styles.productDescription}>{product.description}</p>
            </div>
          </div>
          <div className={styles.productPrice}>
            <span>${product.price}</span>
            <button className={styles.buyButton} onClick={handleBuyClicked}>
              Buy
            </button>
          </div>
        </Container>
      )}
    </Page>
  );
};

export default ProductDetails;
