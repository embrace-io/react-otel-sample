import { Product as ProductType } from "../../Home";
import { FC } from "react";
import Product from "./components/Product";

import styles from "./ProductsList.module.css";

type ProductListProps = {
  products: ProductType[];
};

const ProductsList: FC<ProductListProps> = ({ products }) => {
  return (
    <div className={styles.list}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;
