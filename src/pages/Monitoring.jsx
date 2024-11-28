import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Table,
} from "react-bootstrap";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/iconapp.svg";
import { API } from "../config/api";

export default function Monitoring() {
  let navigate = useNavigate();

  let { data: product, refetch } = useQuery("productCache", async () => {
    const response = await API.get("/products");
    return response.data;
  });

  // State untuk modal delete
  const [idDelete, setIdDelete] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setIdDelete(id);
    setShowDelete(true);
  };

  // Fungsi untuk menghapus data kendaraan
  const deleteData = async () => {
    try {
      await API.delete(`/products/${idDelete}`);
      refetch(); // Refresh data setelah delete
      handleCloseDelete();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  // State untuk modal edit konfirmasi
  const [idEdit, setIdEdit] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (id) => {
    setIdEdit(id);
    setShowEdit(true);
  };

  const handleConfirmEdit = () => {
    navigate(`/edit-data/${idEdit}`);
    handleCloseEdit();
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShowDelete();
  };


  const [filter, setFilter] = useState("");
  let searchData = (e) => {
    setFilter(e.target.value);
  };

  let dataFilter = product?.filter((item) => {
    if (filter === "") {
      return item
    } else if (item.name.toLowerCase().includes(filter.toLowerCase())) {
      return item;
    }
  });

  return (
    <div>
      <Container className="mt-3 ">
        <h3>
          <span>
            <img src={icon} style={{ width: "30px" }} className="m-3" alt="" />
          </span>
          Aplikasi Data HealthCare
        </h3>
        <Card className="bg-search">
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label className="fw-bolder opacity-75 mt-2">
                  Nama pasien
                </Form.Label>
                <Form.Control
                  type="search"
                  id="name"
                  name="name"
                  onChange={searchData.bind(this)}
                  style={{ width: "30%" }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Col className="text-end">
          <Link to={"/add-data"}>
            <Button
              variant="primary"
              className="my-2 fw-bolder"
              style={{ width: "10%" }}
            >
              Add
            </Button>
          </Link>
        </Col>
        <Table responsive striped bordered hover className="text-center">
          <thead>
            <tr className="opacity-75">
              <th>No</th>
              <th>Name</th>
              <th>Sku</th>
              <th>Description</th>
              <th>Price</th>
              <th>image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataFilter?.map((item, index) => (
              <tr key={index} className="opacity-75">
                <td>{index + 1}</td>
                <td>{item?.name}</td>
                <td>{item?.sku}</td>
                <td>{item?.description}</td>
                <td>{item?.price}</td>
                <td>
                  {item?.imageUrl ? (
                    <img
                      src={`http://localhost:8087/${encodeURIComponent(item.imageUrl)}`}  // URL endpoint API di backend
                      alt={`Gambar ${item.name}`}
                      style={{ width: "100px", height: "auto" }}
                      />
                  ) : (
                    "Gambar tidak tersedia"
                  )}
                </td>
                <td className="d-flex gap-3">
    
                  <div
                    className="text-primary pointer"
                    onClick={() => handleShowEdit(item?.id)}
                  >
                    Edit
                  </div>
                  <div
                    className="text-danger pointer"
                    onClick={() => handleShowDelete(item?.id)}
                  >
                    Delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

         {/* Modal Konfirmasi Edit */}
         <Modal show={showEdit} onHide={handleCloseEdit} centered>
          <Modal.Body>
            <h3 className="text-center">Edit Data</h3>
            <div className="my-4">
              Anda yakin ingin mengedit data {idEdit}?
            </div>
            <div className="my-3 text-end">
              <Button
                variant="primary"
                className="me-2"
                style={{ width: "100px" }}
                onClick={handleConfirmEdit}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                style={{ width: "100px" }}
                onClick={handleCloseEdit}
              >
                Batal
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        {/* Modal Konfirmasi Delete */}
        <Modal show={showDelete} onHide={handleCloseDelete} centered>
          <Modal.Body>
            <h3 className="text-center">Delete Data</h3>
            <div className="my-4">
              Anda yakin ingin menghapus data {idDelete}?
            </div>
            <div className="my-3 text-end">
              <Button
                variant="danger"
                className="me-2"
                style={{ width: "100px" }}
                onClick={deleteData} // Memanggil fungsi deleteData untuk menghapus data
              >
                Ok
              </Button>
              <Button
                variant="secondary"
                style={{ width: "100px" }}
                onClick={handleCloseDelete}
              >
                Batal
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}
