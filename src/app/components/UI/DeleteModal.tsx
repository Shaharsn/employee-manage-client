import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface DeleteModalInterface {
  type: string;
  name: string | undefined;
  id: number;
  confirmMethod: (id: number) => void;
  closeModal: () => void;
}

const DeleteModal = (props: DeleteModalInterface) => {
  const onConfirm = () => {
    props.confirmMethod(props.id);
    props.closeModal();
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
          Are you sure you want to delete {props.type}: {props.name}?
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
