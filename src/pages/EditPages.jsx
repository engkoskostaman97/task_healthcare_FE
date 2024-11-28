import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import icon from "../assets/iconapp.svg";
import { API } from "../config/api";

export default function EditPages() {
  const { id } = useParams(); // Mengambil parameter id dari URL

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    image: null, // Akan menyimpan file baru
    previewImage: "", // Untuk preview gambar yang sudah ada
  });

  // Fetch data product berdasarkan id
  const { data: product, isLoading } = useQuery(
    ["product", id],
    async () => {
      const response = await API.get(`/products/${id}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setForm({
          name: data.name,
          sku: data.sku,
          description: data.description,
          price: data.price,
          image: null, // File baru akan diunggah
          previewImage: data.image, // Menampilkan gambar yang sudah ada
        });
      },
    }
  );

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({
        ...form,
        image: files[0], // Menyimpan file baru
        previewImage: URL.createObjectURL(files[0]), // Preview gambar baru
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Fungsi submit data
  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("sku", form.sku);
    formData.append("description", form.description);
    formData.append("price", form.price);

    // Hanya tambahkan file jika file baru dipilih
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await API.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Data berhasil diubah");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengubah data");
    }
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <Container className="mt-3 opacity-75">
        <h3>
          <span>
            <img src={icon} style={{ width: "30px" }} className="m-3" alt="" />
          </span>
          Aplikasi Data HealthCare
        </h3>
        <h5 clabgssName="my-3">Edit Data Pasien</h5>
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
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    {/* Preview gambar */}
                    {form.previewImage && (
                      <div className="mb-3">
                        <img
                          src={form.previewImage}
                          alt="Preview"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" style={{ width: "100px" }}>
                Ubah
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
