import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Category A', 'Offline Sales': 4800, 'Online Sales': 4000 },
  { name: 'Category B', 'Offline Sales': 2300, 'Online Sales': 3400 },
  { name: 'Category C', 'Offline Sales': 4700, 'Online Sales': 5500 },
  { name: 'Category D', 'Offline Sales': 2100, 'Online Sales': 4800 },
  { name: 'Category E', 'Offline Sales': 3300, 'Online Sales': 1700 },
];

const AdminGraph2 = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Offline Sales" stackId="a" fill="#8884d8" />
        <Bar dataKey="Online Sales" stackId="a" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AdminGraph2; 
