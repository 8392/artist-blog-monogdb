/*
  接口响应的数据格式
 */
class Model {
  constructor({ code, data, message, msg }) {
    this.code = code
    if (data) {
      this.data = data
    }
    if (message || msg) {
      this.message = message || msg
    }
  }
}

/* 成功返回的数据格式 */
class SuccessModel extends Model {
  constructor({ code = 0, data = {} } = {}) {
    super({ code, data })
  }
}

/* 失败返回的数据格式 */

class ErrorModel extends Model {
  constructor({ code, message, msg } = {}) {
    super({ code, message, msg })
  }
}


/* 返回分页的数据格式 */

class TableModel extends Model {
  constructor({ code = 0, table, count } = {}) {
    super({ code, data: { table, count } })
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
  TableModel
}