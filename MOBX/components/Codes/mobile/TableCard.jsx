import { withStyles } from "@material-ui/core/styles";

import TrashIcon from "assets/svg/TrashIcon";
import { tableCardStyles as styles } from "styles";

const CardInfo = ({ classes, code, description, deleteContact }) => {
  const handleDelete = () => {
    deleteContact(code);
  };

  return (
    <div className={classes.cardInfo}>
      <p className={classes.name}>{code}</p>
      <p className={classes.name}>{description}</p>

      <div className={classes.cardActions}>
        <span onClick={handleDelete} className={classes.actionBtn}>
          <TrashIcon />
        </span>
      </div>
    </div>
  );
};

const TableCard = ({ classes, data, deleteContact }) => {
  const { tableData, code, description } = data;

  return (
    <div className={classes.cardWrapper}>
      <p className={classes.cardCount}>{tableData.id + 1}</p>

      <CardInfo
        classes={classes}
        code={code}
        description={description}
        deleteContact={deleteContact}
      />
    </div>
  );
};

export default withStyles(styles)(TableCard);
