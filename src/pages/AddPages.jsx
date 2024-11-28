import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { Link } from "react-router-dom";
import icon from "../assets/iconapp.svg";
import { API } from "../config/api";

export default function AddPages() {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    image: null, // File akan disimpan sebagai objek
  });

  const [error, setError] = useState(""); // State untuk menampilkan error
  const [success, setSuccess] = useState(""); // State untuk notifikasi sukses

  const handleChange = (e) => {
    if (e.target.name === "image") {
      // Tangani input file
      setForm({
        ...form,
        image: e.target.files[0], // Simpan file dalam state
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
    setError(""); // Hapus error saat input berubah
    setSuccess(""); // Hapus pesan sukses saat input berubah
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setError(""); // Reset error state sebelum submit
      setSuccess(""); // Reset pesan sukses sebelum submit

      // Validasi file (opsional)
      if (form.image && form.image.size > 5 * 1024 * 1024) {
        setError("Ukuran file tidak boleh lebih dari 5MB");
        return;
      }

      // Buat FormData
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("sku", form.sku);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("image", form.image);

      // Kirim ke API
      const response = await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Header untuk FormData
        },
      });

      // Validasi respons dari API
      if (response.data.error) {
        setError(response.data.error); // Tampilkan error dari API
      } else {
        setSuccess("Data berhasil tersimpan"); // Tampilkan pesan sukses
        setForm({
          name: "",
          sku: "",
          description: "",
          price: "",
          image: null,
        }); // Reset form
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat menyimpan data"); // Pesan error generik
    }
  });

  return (
    <div>
      <Container className="mt-3 opacity-75">
        <h3>
          <span>
            <img src={icon} style={{ width: "30px" }} className="m-3" alt="" />
          </span>
          Aplikasi Data HealthCare
        </h3>
        <h5 className="my-3">Tambah Data Pasien</h5>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Row>
            <Col>
              <Row>
                <Col xs={12} md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nama Pasien</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                      type="text"
                      id="sku"
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>PRICE</Form.Label>
                    <Form.Control
                      type="text"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              {/* Menampilkan pesan error atau sukses */}
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              <Button type="submit" style={{ width: "100px" }}>
                Simpan
              </Button>
              <Link to={"/"}>
                <Button
                  variant="secondary"
                  className="ms-2"
                  style={{ width: "100px" }}
                >
                  Kembali
                </Button>
              </Link>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
}
