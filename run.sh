echo "authenticating prisma "
prisma login --key eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjanhoMzNjYTBrcnM3MDg2MXEwd3lkYndnIiwiaWF0IjoxNTYzMDMzODA0LCJleHAiOjE1NjU2MjU4MDR9.FVfedL54Pj25Qwv4aM8ArcIF1FZxRTPjds7SaWhMaF0
echo "prisma deploy command "
prisma deploy
echo "get-schema command"
yarn run get-schema
echo "end get schema command"
yarn run start