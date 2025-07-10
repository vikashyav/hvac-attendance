const {User, sequelize}= require("../../../database/models")

export async function GET(request) {
  // const userData=  await User.findAll();
  await sequelize.sync(); // create table if not exists

  const users = await User.findAll();
  return new Response(JSON.stringify({ message: 'Hello from App Router API!', data: users }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request) {
  const body = await request.json();
  return new Response(JSON.stringify({ received: body }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
