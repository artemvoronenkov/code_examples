import { withStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import Cell from "./Cell";

import EmailIcon from "assets/svg/EmailIcon";
import ExtensionIcon from "assets/svg/ExtensionIcon";
import PhoneIcon from "assets/svg/PhoneIcon";
import DepartmentsIcon from "assets/svg/DepartmentsIcon";
import ChevronRightIcon from "assets/svg/ChevronRightIcon";
import TrashIcon from "assets/svg/TrashIcon";
import { detailsPanelStyles as styles } from "styles";

const Cells = ({ classes, cells }) => (
  <div className={classes.row}>
    {cells.map(({ text, icon }) => (
      <Cell key={text} text={text} icon={icon} />
    ))}
  </div>
);
const DetailsPanel = ({
  classes,
  handleDelete,
  userId,
  fullName,
  emailAddress,
  extension,
  phoneNumber,
  departmentName,
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    handleDelete({ userId, fullName });
  };

  const cells = [
    {
      text: emailAddress,
      icon: <EmailIcon />,
    },
    {
      text: extension,
      icon: <ExtensionIcon />,
    },
    {
      text: phoneNumber,
      icon: <PhoneIcon />,
    },
    {
      text: departmentName,
      icon: <DepartmentsIcon />,
    },
  ];

  return (
    <>
      <input className={classes.checkbox} type="checkbox" id={userId} />
      <label className={classes.label} htmlFor={userId}>
        <ChevronRightIcon />
      </label>

      <div className={`detail ${classes.detail}`}>
        <Cells classes={classes} cells={cells} />

        <div className={classes.footer}>
          <span onClick={handleClick} className={classes.deleteBtn}>
            <TrashIcon />
            <span>{t("shared:Delete")}</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default withStyles(styles)(DetailsPanel);
