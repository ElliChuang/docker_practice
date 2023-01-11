import mysql.connector 
from mysql.connector import pooling 
import os
from dotenv import load_dotenv

class DB:
    def rds_get_connection():
        # password
        load_dotenv()
        rds_DB_PW = os.environ.get("rds_DB_PW")
        rds_DB_HOST = os.environ.get("rds_DB_HOST")

        # 建立db
        dbconfig = {
            "user" : "admin",
            "password" : rds_DB_PW,
            "host" : rds_DB_HOST,
            "database" : "newstage",
        }

        # create connection pool
        connection_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name = "pool",
            pool_size = 30,
            pool_reset_session = True,
            **dbconfig
        )

        # 連線
        connection_object = connection_pool.get_connection()

        return connection_object