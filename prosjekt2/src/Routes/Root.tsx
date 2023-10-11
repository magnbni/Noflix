import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import ComboBox from "../Components/ComboBox";

export default function Root() {
  const navigate = useNavigate();
  const [, setSelectedMovie] = useState<string | null>(null);

  const handleMovieSelect = (selectedOption: string | null) => {
    if (selectedOption) {
      setSelectedMovie(selectedOption);
      navigate(`/${selectedOption}`);
    }
  };
  return (
    <div>
      <div className="logoDiv">
        <img
          className="logo"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADL0lEQVR4nO2ZzUvUQRjHP2ZpkNs5KJbo2Bp1KetUnQtUqOhmL1BkanXq2MtJKrG0P6Gia4e6dA2yS5laBKVi9geImRYZGxPfgWHZ3d/bjPyM/cKwsDPzzHxmnnnmmV0Iq03AaeAJMA38AJaAT8Bj4BTQQs7VBcwD5YjyBegmh2oChpyJvgcGgN3AFpUScAWYcNoNAhvIkSzET+BixORM3SW1tTDBZFZvGJiSfy9oJYdUV+lOFuJwgjGOODBdnuf/7xCOAqt1/NvU3QM2q/2svjc7kVS96vtZQcIbxEsZXgHuAwccH+8AHjir+FzRyZ6JNL7eDEzKxglfIKMy+BXYU6fdXicyrejTHOy0uiobj/CgklxmJQLChbE7U1Z0yjJ2WfdMZg3LmPmMqxEHpJBh7IJsLOJBH2Rsf4I+HZ5BlvGgRRlrSzGBrK7VLhsmncms5Ywg5sZOq2uy8RQP+ihjJtzG1UEHZCJD+J2SjZN40EMZM/dE0nBti0k7kqpPfWd8XYgm5P5RSDWhNUr7gF/Ab03G9jVpR1wdlY0y0IlH3ZXR+QgYA/FNbc3tb3Tbybd65TK11Cx4C3EHzzI+/syZ0IjOQZvKIbmTncCLCne45bjZpG7sktO/XQfbngkL0UQAtehSrJc0+iirCQ/3RqAnKcw2pQvlwOUdsD0GwBllx6ZPbBlXeetktMcS3i1RapNN+0ocB1prAJzVk9iFj63LDoRPgGqX6bTG6qtYyHNOnX2rJAYZUwezaqFlX5avBHBe94kL0KPdSQyykCJVSauCEyFnagBYJQZJ3CGjXP83T+YLFQDrDqSnBsC6A4lSA2St1NgRXyvkS40d8bVCvtTYEV8r5Ev/3YXoPUX5voZJ49aQSeMbdThOeHVrrLEQafyAOkxk/D03zm7YSfeHeFi16vlZlrFOz0AFPagshBmrJcRT12iHAxOyjGusID8+uDtjtvy1EwB8lCXZ7Nd/kHGV6uegKBUdH75Rpf666uaAXeRUxRoQNyv+L881TLEOhHWd3MPsdP5PNxOvhJiNUW9s5Hon5rTibrvc7UwxJkS19rmBKSaEyCVMMSVEtf7BYP4C5K/s4NIpf6sAAAAASUVORK5CYII="
        />
      </div>
      <h1> Search for a movie</h1>
      <ComboBox onMovieSelect={handleMovieSelect} />
    </div>
  );
}
