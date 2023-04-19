import React, { useState, useEffect, Fragment } from "react";
import { Grid } from "@mui/material";
import SideBarWrapper from "./SideBarWrapper";
import { Api } from "../../utils/Api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FiEdit2 } from "react-icons/fi";
import { ImBin2 } from "react-icons/im";
import CustomDeleteModal from "./Models/CustomDeleteModal";
import AddCategoryModal from "./Models/AddCategoryModal";
import moment from "moment";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import Loader from "../../Components/Loader";
import { IoIosAdd } from "react-icons/io";
import AuthProtected from "../../utils/AuthProtected";
const Index = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const getAllCategories = async (page) => {
    setLoading(true);
    const response = await Api("get", `api/category?page=${page}&limit=20`);
    if (response.status === 200) {
      setLoading(false);
      setCategories(response.data.data);
      if (pages.length === 0) {
        for (let i = 1; i <= response.data.pagination.pages; i++) {
          pages.push(i);
        }
        setPages(pages);
      }
    } else {
      setLoading(false);
      toast.error(response.data.msg);
    }
  };
  useEffect(() => {
    getAllCategories(currentPage);
  }, [currentPage]);
  const deleteCategory = async () => {
    setLoading(true);
    const response = await Api("DELETE", `api/admin/category/${category?._id}`);
    if (response.status === 200) {
      setLoading(false);
      setShowDeleteModal(false);
      setCategories(categories?.filter((e) => e._id !== category?._id));
    } else {
      setLoading(false);
      toast.error(response.data.msg);
    }
  };
  return (
    <Fragment>
      {loading ? <Loader /> : null}
      <SideBarWrapper>
        <div className={`container-fluid mt-5 pt-4`}>
          <div className="row d-flex justify-content-end">
            <div className="col-lg-3 col-md-4 col-sm-4 col-6 d-flex justify-content-end">
              <div
                onClick={() => {
                  setActionType("add");
                  setShowModal(true);
                }}
                className="add-category-btn"
              >
                <IoIosAdd className="IoIosAdd-addCategory" />
                Add New
              </div>
            </div>
          </div>
          <Grid container sapcing={1} className="mt-3">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Created at</TableCell>
                    <TableCell align="left">Image</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories?.map((row, index) => (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell className="text-capitalize" align="left">
                        {row?.name}
                      </TableCell>
                      <TableCell align="left">{moment(row?.created_at).format("lll")}</TableCell>
                      <TableCell align="left">
                        <img src={row?.image} style={{ height: "30px", width: "30px", borderRadius: 50, cursor: "pointer" }} onClick={() => window.open(row?.image, "blank")} />
                      </TableCell>
                      <TableCell align="left" className="text-capitalize">
                        <span>
                          <FiEdit2
                            className="service-icons"
                            onClick={() => {
                              setCategory(row);
                              setActionType("edit");
                              setShowModal(true);
                            }}
                          />
                        </span>
                        <span>
                          <ImBin2
                            className="service-icons"
                            onClick={() => {
                              setCategory(row);
                              setShowDeleteModal(true);
                            }}
                          />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {categories?.length > 0 ? <Pagination currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page)} pages={pages} /> : null}
          </Grid>
        </div>
      </SideBarWrapper>
      {showModal && (
        <AddCategoryModal
          showModal={showModal}
          hideModal={(e) => setShowModal(e)}
          category={(data) => {
            categories.unshift(data);
            setCategories(categories);
          }}
          actionType={actionType}
          data={category}
          callback={() => getAllCategories()}
          setLoading={setLoading}
        />
      )}
      {showDeleteModal && (
        <CustomDeleteModal
          showModal={showDeleteModal}
          hideModal={() => setShowDeleteModal(false)}
          title="Confirmation"
          subTitle="Are you sure you want to delete this category ? This can't be undone."
          callback={() => deleteCategory()}
          setLoading={setLoading}
        />
      )}
    </Fragment>
  );
};
export default AuthProtected(Index);
