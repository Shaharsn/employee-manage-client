import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IDeleteModalProps {
  type: string;
  name: string
  confirmMethod: () => void;
  closeModal: () => void;
}

const DeleteModal = (props: IDeleteModalProps) => {
  const {type, name, confirmMethod, closeModal } = props;

  const onConfirm = () => {
    confirmMethod();
    closeModal();
  };

  return (
    <>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "95%" },
        }}
        autoComplete="off"
      >
        <Typography sx={{ m: 1 }}>
          Are you sure you want to delete {type}: {name}?
        </Typography>
      </Box>

      <Box textAlign="center">
        <Button variant="contained" sx={{ m: 1 }} onClick={onConfirm}>
          Confirm
        </Button>
      </Box>
    </>
  );
};
export default DeleteModal;
