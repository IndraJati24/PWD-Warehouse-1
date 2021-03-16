import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Button,
  Pagination,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

export default function Home() {
  const [data, setData] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [currentKategori, setcurrentKategori] = useState(null);

  const [currentPage, setcurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(10);

  const [pageNumberLimit, setpageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:1000/product/getAll");
      let res2 = await axios.get("http://localhost:1000/product//getCategory");
      res = res.data.filter((item) => item.stock > 0);

      setData(res);
      setKategori(res2.data);
    };
    getData();
  }, []);

  // UPDATECATEGORY
  useEffect(() => {
    const getData = async () => {
      let res = await axios.get("http://localhost:1000/product/getAll");
      if (currentKategori) {
        res = res.data.filter(
          (item) => item.nama_kategori === currentKategori && item.stock > 0
        );
        setData(res);
      } else {
        res = res.data.filter((item) => item.stock > 0);
        setData(res);
      }
    };
    getData();
  }, [currentKategori]);

  function hargaDsc(a, b) {
    if (a.price < b.price) {
      return 1;
    }
    if (a.price > b.price) {
      return -1;
    }
    return 0;
  }
  function hargaAsc(a, b) {
    if (a.price < b.price) {
      return -1;
    }
    if (a.price > b.price) {
      return 1;
    }
    return 0;
  }
  const hargaTerkecil = () => {
    let temp = [...data];
    temp.sort(hargaAsc);
    setData(temp);
  };
  const hargaTerbesar = () => {
    let temp = [...data];
    temp.sort(hargaDsc);
    setData(temp);
  };

  function namaAsc(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  const urutAbjad = () => {
    let temp = [...data];
    temp.sort(namaAsc);
    setData(temp);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let items = [];
  for (
    let number = 1;
    number <= Math.ceil(data.length / itemsPerPage);
    number++
  ) {
    items.push(number);
  }

  const pages = items.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <Pagination.Item
          key={number}
          onClick={() => setcurrentPage(number)}
          active={number === currentPage}
        >
          {number}
        </Pagination.Item>
      );
    } else {
      return null;
    }
  });

  const handleNextbtn = () => {
    setcurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };
  const handlePrevbtn = () => {
    setcurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  const Product = () => {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {data.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => {
          if (item.stock === 0) return;
          return (
            <Card style={{ width: "12.5rem", margin: "1rem 1rem" }} key={index}>
              <Card.Img
                variant="top"
                src={item.image}
                style={{ height: "13rem" }}
              />
              <Card.Body>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>IDR {item.price.toLocaleString()}</Card.Text>
                  <div>
                    <Button
                      style={{ width: "5.5rem", marginRight: "8px" }}
                      variant="success"
                    >
                      Buy
                    </Button>
                    <Button variant="warning">Cart</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    );
  };
  const handleCategory = (nama_kategori) => {
    setcurrentPage(1);
    setcurrentKategori(nama_kategori);
  };
  const renderCategory = () => {
    return (
      <DropdownButton
        variant="outline-info"
        title={currentKategori ? currentKategori : "Category"}
      >
        <Dropdown.Item onClick={() => setcurrentKategori(null)}>
          All Product
        </Dropdown.Item>
        {kategori.map((item, index) => {
          return (
            <Dropdown.Item onClick={() => handleCategory(item.nama_kategori)}>
              {item.nama_kategori}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
  };

  return (
    <div style={{ margin: "2rem 10rem" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button
          variant="outline-info"
          onClick={hargaTerkecil}
          style={{ marginLeft: "1rem" }}
        >
          Harga Terkecil
        </Button>
        <Button
          variant="outline-info"
          onClick={hargaTerbesar}
          style={{ marginLeft: "2rem" }}
        >
          Harga Terbesar
        </Button>
        <Button
          variant="outline-info"
          onClick={urutAbjad}
          style={{ marginLeft: "2rem" }}
        >
          Nama
        </Button>
        <div style={{ marginLeft: "2rem" }}>{renderCategory()}</div>
      </div>
      <Product />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "3rem",
        }}
      >
        <Pagination>
          <Pagination.Prev
            onClick={handlePrevbtn}
            disabled={currentPage === 1}
          />
          {minPageNumberLimit >= 1 ? (
            <Pagination.Ellipsis onClick={handlePrevbtn} />
          ) : null}
          {pages}
          {items.length > maxPageNumberLimit ? (
            <Pagination.Ellipsis onClick={handleNextbtn} />
          ) : null}
          <Pagination.Next
            onClick={handleNextbtn}
            disabled={currentPage === items.length}
          />
        </Pagination>
      </div>
    </div>
  );
}
