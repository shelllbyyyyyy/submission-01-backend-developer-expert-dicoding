export class REGISTER_USER {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION';
  public static USERNAME_LIMIT_CHAR = 'REGISTER_USER.USERNAME_LIMIT_CHAR';
  public static USERNAME_CONTAIN_RESTRICTED_CHARACTER = 'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER';
}

export class REGISTERED_USER {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class USER_LOGIN {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION';
  public static USERNAME_LIMIT_CHAR = 'USER_LOGIN.USERNAME_LIMIT_CHAR';
  public static USERNAME_CONTAIN_RESTRICTED_CHARACTER = 'USER_LOGIN.USERNAME_CONTAIN_RESTRICTED_CHARACTER';
}

export class NEW_AUTH {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class AUTHENTICATION_REPOSITORY {
  public static METHOD_NOT_IMPLEMENTED = 'AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED';
}

export class AUTHENTICATION_TOKEN_MANAGER {
  public static METHOD_NOT_IMPLEMENTED = 'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED';
}

export class DELETE_AUTHENTICATION_USE_CASE {
  public static NOT_CONTAIN_REFRESH_TOKEN = 'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN';
  public static PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION = 'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class REFRESH_AUTHENTICATION_USE_CASE {
  public static NOT_CONTAIN_REFRESH_TOKEN = 'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN';
  public static PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION = 'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class NEW_THREAD {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class NEW_COMMENT {
  public static NOT_CONTAIN_NEEDED_PROPERTY = 'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY';
  public static NOT_MEET_DATA_TYPE_SPECIFICATION = 'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION';
}

export class MESSAGE {
  public static SERVER_ERROR = 'terjadi kesalahan di server kami';

  public static REGISTER_PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY = 'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada';
  public static REGISTER_PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION = 'tidak dapat membuat user baru karena tipe data tidak sesuai';
  public static REGISTER_PAYLOAD_USERNAME_LIMIT_CHAR = 'tidak dapat membuat user baru karena karakter username melebihi batas limit';
  public static REGISTER_PAYLOAD_USERNAME_CONTAIN_RESTRICTED_CHARACTER = 'tidak dapat membuat user baru karena username mengandung karakter terlarang';
  public static REGISTER_PAYLOAD_USERNAME_UNAVAILABLE = 'username tidak tersedia';

  public static USER_LOGIN_NOT_CONTAIN_NEEDED_PROPERTY = 'harus mengirimkan username dan password';
  public static USER_LOGIN_NOT_MEET_DATA_TYPE_SPECIFICATION = 'username dan password harus string';
  public static LOGIN_PAYLOAD_USER_UNAVAILABLE = 'user tidak ditemukan';
  public static WRONG_CREDENTIALS = 'kredential salah';
  public static USER_NOT_FOUND = 'user tidak ditemukan';

  public static REFRESH_TOKEN_NOT_MEET_DATA_TYPE_SPECIFICATION = 'refresh token harus string';
  public static REFRESH_AUTHENTICATION_USE_CASE_NOT_CONTAIN_REFRESH_TOKEN = 'harus mengirimkan token refresh';
  public static REFRESH_TOKEN_INVALID = 'refresh token tidak valid';
  public static REFRESH_TOKEN_UNAVAILABLE = 'refresh token tidak ditemukan di database';

  public static DELETE_AUTHENTICATION_USE_CASE_NOT_CONTAIN_REFRESH_TOKEN = 'harus mengirimkan token refresh';
  public static DELETE_AUTHENTICATION_USE_CASE_NOT_MEET_DATA_TYPE_SPECIFICATION = 'refresh token harus string';

  public static NEW_THREAD_NOT_CONTAIN_NEEDED_PROPERTY = 'harus mengirimkan title dan body';
  public static NEW_THREAD_NOT_MEET_DATA_TYPE_SPESIFICATION = 'title dan body harus string';

  public static THREAD_NOT_FOUND = 'thread tidak ditemukan di database';

  public static NEW_COMMENT_NOT_CONTAIN_NEEDED_PROPERTY = 'harus mengirimkan content';
  public static NEW_COMMENT_NOT_MEET_DATA_TYPE_SPESIFICATION = 'content harus string';

  public static DELETE_COMMENT_RESTRICTED = 'hanya pemilik komen yang dapat menghapus';
  public static DELETE_COMMENT_FAIL = 'gagal menghapus comment';

  public static COMMENT_NOT_FOUND = 'comment tidak ditemukan di database';

  public static METHOD_NOT_IMPLEMENTED = 'method tidak diimplementasikan';
}
