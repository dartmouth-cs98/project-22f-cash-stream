import React from "react";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled">{props.children}</MuiAlert>;
});

//This is a snackbar to display message that the transaction has been broadcasted (and a link to etherscan)
//(for creating/deleting streams and wrapping/unwrapping tokens)
export const SnackBar = (props) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setOpenSnackBar(false);
  };

  return (
    <Stack spacing={2} sx={{width: '100%'}}>
      <Snackbar open={props.openSnackBar} autoHideDuration={8000} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
        <Alert onClose={handleClose} severity="success" children={props.children}/>
      </Snackbar>
    </Stack>
  );
}