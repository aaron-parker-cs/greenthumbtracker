import { Container } from "react-bootstrap";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

interface ChartProps {
  header: string;
  data: ChartData[];
}

export default function Chart(props: ChartProps) {
  // yes I know any defeats the purpose of TS, but I hate when it keeps erroring me

  const style = {
    margin: "0",
    padding: "0",
    border: "2px solid black",
    minWidth: "20vw",
    maxWidth: "20vw",
    height: "25vh",
    display: "block",
  };

  return (
    <Container style={style} className="m-5 foreground-container">
      <p style={{ textAlign: "center", height: "10%", marginBottom: "0" }}>
        {props.header}
      </p>{" "}
      {/* replace h1 text with {props.header} */}
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          width={500}
          height={400}
          data={props.data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  );
}
