import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { filterRamo } from "../../../stores/vagas/api";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Ramo(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState("");
  const [ramo, setRamo] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value || "");
    setRamo(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSendPesquisa = async () => {
    if (ramo === "sem-filtro") {
      props.getVagas();
      setOpen(false);
      return;
    }

    setOpen(false);

    let data = {
      tuple: `('${ramo}')`,
    };

    let res = await filterRamo(data);

    props.getVagas(res);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" onClick={handleClickOpen}>
        Filtro por segmento da empresa
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Selecioe um Segmennto</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-dialog-select-label">Segmennto</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={age}
                onChange={handleChange}
                input={<Input />}
              >
                <MenuItem value="sem-filtro">
                  <em>Sem filtro</em>
                </MenuItem>
                <MenuItem value="alimenntos">Alimentos</MenuItem>
                <MenuItem value="industria">Industria</MenuItem>
                <MenuItem value="comercio">Comércio</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSendPesquisa} color="primary">
            Pesquisar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
