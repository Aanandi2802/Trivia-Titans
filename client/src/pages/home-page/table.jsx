import React, { Component, createRef } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import ToastContainer from "react-bootstrap/ToastContainer";
import BootstrapToast from "../../components/toasts/toasts";

import "./table.scss";

const $ = require("jquery");
$.DataTable = require("datatables.net");

const mapStateToProps = (state) => {
  return {
    user: state.loginStatus.userInfo,
  };
};

function reloadTableData(data) {
  const table = $(".data-table-wrapper").find("table").DataTable();
  table.clear();
  table.rows.add(data);
  table.draw();
}

function updateTable(data) {
  const table = $(".data-table-wrapper").find("table").DataTable();
  let dataChanged = false;
  table.rows().every(function () {
    const oldNameData = this.data();
    const newNameData = data.find((nameData) => {
      return nameData.name === oldNameData.name;
    });
    if (oldNameData.nickname !== newNameData.nickname) {
      dataChanged = true;
      this.data(newNameData);
    }
    return true;
  });

  if (dataChanged) {
    table.draw();
  }
}

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      eventData: {},
      eventJoined: false,
      toasts: [],
    };
    this.tableRef = createRef();
  }

  // Function to add a new toast
  addToast = (variant, title, body) => {
    const newToast = {
      id: Math.random(),
      Component: BootstrapToast,
      variant: variant, // Customize the variant here
      title: title, // Customize the title here
      body: body, // Customize the body here
    };

    this.setState((prevState) => ({
      toasts: [...prevState.toasts, newToast],
    }));
  };

  removeToast = (id) => {
    this.setState((prevState) => ({
      toasts: prevState.toasts.filter((toast) => toast.id !== id),
    }));
  };

  // Function to be called on button click
  handleJoinClick = (data) => {
    let payload = {
      teamId: this.props.user.t_name,
      gameId: data.gameId,
    };
    // Perform desired actions or call the necessary function here
    fetch(
      `https://us-central1-serverless-project-392613.cloudfunctions.net/function-3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data, data.message);
            throw new Error(data.message);
          });
        }
      })
      .then((result) => {
        // Handle the response from the API
        console.log(result); // Do something with the response
        this.props.modifiedFunc(result.data);
        this.addToast(
          "Success",
          "Success",
          "Your team has been registered for this event successfully."
        );
      })
      .catch((error) => {
        this.addToast("Danger", "Error", error.message);
      });
  };

  handleJoinClickModal = () => {
    let payload = {
      teamId: this.props.user.t_name,
      gameId: this.state.eventData.gameId,
    };
    // Perform desired actions or call the necessary function here
    fetch(
      `https://us-central1-serverless-project-392613.cloudfunctions.net/function-3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data, data.message);
            throw new Error(data.message);
          });
        }
      })
      .then((result) => {
        this.setState({ showModal: false, eventData: {} });
        // Handle the response from the API
        console.log(result); // Do something with the response
        this.props.modifiedFunc(result.data);
        this.addToast(
          "Success",
          "Success",
          "Your team has been registered for this event successfully."
        );
      })
      .catch((error) => {
        this.addToast("Danger", "Error", error.message);
      });
  };

  // Function to be called on button click
  handleLeaveClick = (data) => {
    let payload = {
      teamId: this.props.user.t_name,
      gameId: data.gameId,
    };
    // Perform desired actions or call the necessary function here
    fetch(
      `https://us-central1-serverless-project-392613.cloudfunctions.net/function-5`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data, data.message);
            throw new Error(data.message);
          });
        }
      })
      .then((result) => {
        // Handle the response from the API
        console.log(result); // Do something with the response
        this.props.modifiedFunc(result.data);
        this.addToast(
          "Success",
          "Success",
          "Your team has been removed for this event successfully."
        );
      })
      .catch((error) => {
        this.addToast("Danger", "Error", error.message);
      });
  };

  handleLeaveClickModal = () => {
    let payload = {
      teamId: this.props.user.t_name,
      gameId: this.state.eventData.gameId,
    };
    // Perform desired actions or call the necessary function here
    fetch(
      `https://us-central1-serverless-project-392613.cloudfunctions.net/function-5`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data, data.message);
            throw new Error(data.message);
          });
        }
      })
      .then((result) => {
        this.setState({ showModal: false, eventData: {} });
        // Handle the response from the API
        console.log(result); // Do something with the response
        this.props.modifiedFunc(result.data);
        this.addToast(
          "Success",
          "Success",
          "Your team has been removed for this event successfully."
        );
      })
      .catch((error) => {
        this.addToast("Danger", "Error", error.message);
      });
  };

  handleNameClick = (data) => {
    // alert("You clicked on " + data + "'s row");
    // eventData: data, showModal: true
    console.log(data);
    let foundIndex;
    if (Array.isArray(data.teamScores)) {
      foundIndex = data.teamScores.findIndex((item) => {
        const segments = item.teamId._path.segments;
        return segments.length > 1 && segments[1] === this.props.user.t_name;
      });
    } else {
      foundIndex = -1;
    }

    let eventJoined = false;

    if (foundIndex !== -1) {
      eventJoined = true;
    }
    this.setState(
      { showModal: true, eventData: data, eventJoined: eventJoined },
      () => {
        console.log(this.state); // This will log the updated state
      }
    );
  };

  componentDidMount() {
    $(this.tableRef.current).DataTable({
      dom: '<"data-table-wrapper"lf<t>ip>',
      data: this.props.data,
      columns: this.props.columns,
      //   ordering: false,
      hover: true,
      // rowCallback: (row, data) => {
      //   $(row).on("click", () => {
      //     this.handleNameClick(data);
      //   });
      // },
      createdRow: (row, data) => {
        const nameColumnIndex = this.props.columns.findIndex(
          (column) => column.data === "name"
        );
        const nameCell = $("td", row).eq(nameColumnIndex);
        nameCell.on("click", () => {
          this.handleNameClick(data);
        });

        const statusColumnIndex = this.props.columns.findIndex(
          (column) => column.data === "status"
        );
        const statusCell = $("td", row).eq(statusColumnIndex);
        statusCell.on("click", () => {
          if (
            statusCell[0].innerHTML ===
            '<button class="btn btn-primary w-100">Join</button>'
          ) {
            this.handleJoinClick(data);
          } else if (
            statusCell[0].innerHTML ===
            '<button class="btn btn-secondary w-100">Leave</button>'
          ) {
            this.handleLeaveClick(data);
          }
        });
      },
      // statusCell.on("click", () => {
      //   this.handleJoinClickBtn(data);
      // });
    });
  }

  componentWillUnmount() {
    $(".data-table-wrapper").find("table").DataTable().destroy(true);
  }

  shouldComponentUpdate(nextProps) {
    // console.log(nextProps);
    if (nextProps.data !== this.props.data) {
      reloadTableData(nextProps.data);
    }
    // else {
    //   updateTable(nextProps.data);
    // }
    return true;
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    // const { data, columns } = this.props;
    const { showModal, toasts } = this.state;
    console.log(showModal);
    return (
      <div>
        <div className="row">
          <table ref={this.tableRef} className="hover w-100" />
        </div>
        <div>
          {/* Modal */}
          <Modal show={showModal} onHide={this.closeModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Game Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div>Event Name: {this.state.eventData.name}</div>
                <div>
                  Event Date:{" "}
                  {new Date(
                    this.state.eventData.startTime
                  ).toLocaleDateString()}
                </div>
                <div>
                  Event Time:{" "}
                  {new Date(
                    this.state.eventData.startTime
                  ).toLocaleTimeString()}
                </div>
                <div>Event Description: {this.state.eventData.desc}</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="dark" onClick={this.closeModal}>
                Close
              </Button>
              {this.state.eventJoined ? (
                <Button
                  variant="secondary"
                  onClick={this.handleLeaveClickModal}
                >
                  Leave
                </Button>
              ) : (
                <Button variant="primary" onClick={this.handleJoinClickModal}>
                  Join
                </Button>
              )}
            </Modal.Footer>
          </Modal>
          <ToastContainer className="position-fixed top-0 end-0 p-3">
            {toasts.map(({ id, Component, variant, title, body }) => (
              <Component
                key={id}
                variant={variant}
                title={title}
                body={body}
                handleRemove={() => this.removeToast(id)}
              />
            ))}
          </ToastContainer>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.array,
  user: PropTypes.object,
  modifiedFunc: PropTypes.func,
};

const ConnectedClassComponent = connect(mapStateToProps)(Table);

export default React.memo(ConnectedClassComponent);
