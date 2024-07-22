import { useEffect, useState } from "react";
import { Product } from "../Home/Home";
import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";

import styles from "./ProductDetails.module.css";

import fakeProductPicture from "../../assets/fake-product-picture.png";

const ProductDetails = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/products/${productId}`,
        );
        const data = await response.json();

        setProduct(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchProducts();
  }, [productId]);

  if (!product) {
    return "Loading";
  }

  return (
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
        <button className={styles.buyButton}>Buy</button>
      </div>
    </Container>
  );
};

export default ProductDetails;
