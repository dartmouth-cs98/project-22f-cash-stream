import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Form, FormGroup } from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '60%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
};

export const EditForm = (props) => {
  const [name, setName] = useState("");

  const handleNameChange = (e) => {
    setName(() => ([e.target.name] = e.target.value));
  };

  async function saveName(){
    if (props.token == 'ETHx'){
      var contact = localStorage.getItem('ETHx_contact');
      var parsed_contact = JSON.parse(contact);
      var exists = false;

      for(const item of parsed_contact){
        if(typeof item[props.address] !== "undefined"){
          item[props.address] = name
          exists = true;
        }
      }
      if(!exists){
        parsed_contact.push({[props.address]:name})
      }

      localStorage.setItem('ETHx_contact', JSON.stringify(parsed_contact));
    }
    else if (props.token == 'fDAIx'){
      var contact = localStorage.getItem('fDAIx_contact');
      var parsed_contact = JSON.parse(contact);
      var exists = false;

      for(const item of parsed_contact){
        if(typeof item[props.address] !== "undefined"){
          item[props.address] = name
          exists = true;
        }
      }
      if(!exists){
        parsed_contact.push({[props.address]:name})
      }

      localStorage.setItem('fDAIx_contact', JSON.stringify(parsed_contact));
    }
    
    setName("")
    props.handleEditClose()
  }

  return (
      <Modal
        open={props.editOpen}
        onClose={props.handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        color='success'
      >
        <Box sx={style}>
          <div className='editFormTitle'>
            <Typography id="modal-modal-title" sx={{fontSize: 18}} component="h2">
              <FontAwesomeIcon icon={faPenToSquare} className='marginRight15px cursor'/>Edit Stream Name
            </Typography>
          </div>

          <div className='editFormField'>
            <Form className="flowForm">
              <FormGroup>
                <TextField
                  label="stream name"
                  name="stream name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="name"
                  color="success"
                  sx={{width: "100%", marginBottom: "10px"}}
                />
              </FormGroup>
            </Form>
            {
            name == ""
            ? <Button disabled variant='contained' onClick={saveName} sx={{textTransform:"none", height:"45px", color: "white", fontFamily:'Lato', fontWeight: "700"}}>
              save
            </Button>
            : <Button variant='contained' onClick={saveName} sx={{textTransform:"none", height:"45px", color: "white", fontFamily:'Lato', fontWeight: "700"}}>
              save
            </Button>
            }
          </div>
        </Box>
      </Modal>
  )
}