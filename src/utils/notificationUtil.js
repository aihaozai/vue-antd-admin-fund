import { notification } from 'ant-design-vue'

function successful (msg, desc, time) {
  notification['success']({
    message: msg,
    description:desc,
    duration: time || 2
  });
}
function info (msg, desc, time) {
  notification['info']({
    message: msg,
    description:desc || '',
    duration: time || 2
  });
}

export  {
  successful,
  info
}
