import Box from '@mui/material/Box'; 
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

export const TxModal = (props) => {
  return (
      <Modal
        open={true}
        onClose={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{marginLeft: "20%"}}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: '#212121',
          //border: '2px solid #4caf50',
          borderRadius: '15px',
          boxShadow: 10,
          p: 4,
          outline: 0
        }}>
          <div>
            <Typography sx={{textAlign: 'center'}}>{props.txMsg}</Typography>
            <LinearProgress color="success" sx={{marginTop: '20px'}}/>
          </div>
        </Box>
      </Modal>
  );
}