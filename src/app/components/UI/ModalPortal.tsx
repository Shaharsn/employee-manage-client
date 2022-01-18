import ReactDOM from "react-dom";
import { Modal, Backdrop, Fade, Typography, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";



interface IModalPortalProps {
  header: string;
  children: React.ReactNode;
  showModal: boolean;
  width?: number;
  closeModal: () => void;
}

const ModalPortal = (props: IModalPortalProps) => {
  const { header, children, showModal, width, closeModal } = props;

  const boxStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width || 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
  };

  return props.showModal
    ? ReactDOM.createPortal(
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showModal}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showModal}>
            <Box sx={boxStyle}>
              <IconButton
                aria-label="edit"
                onClick={closeModal}
                sx={{ float: "right", padding: ["3px"] }}
              >
                <CloseIcon />
              </IconButton>

              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {header}
              </Typography>

              {children}
            </Box>
          </Fade>
        </Modal>,
        document.body
      )
    : null;
};

export default ModalPortal;
