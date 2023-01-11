from flask import Flask, render_template, request, jsonify, redirect
import boto3
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from mysql.connector import errorcode
import mysql.connector 
from DB import DB

app = Flask(__name__, static_folder= "static", static_url_path = "/static")

load_dotenv()
ACCESS_KEY_ID = os.environ.get("ACCESS_KEY_ID")
ACCESS_SECRET_KEY = os.environ.get("ACCESS_SECRET_KEY")
s3 = boto3.client('s3',
                    aws_access_key_id = ACCESS_KEY_ID,
                    aws_secret_access_key= ACCESS_SECRET_KEY,
                     )

BUCKET_NAME = 'week1bucket'
CLOUDFRONT_PATH = 'd12sr6yglyx2x4.cloudfront.net'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/upload', methods = ['POST', "GET"])
def upload():
    if request.method == "POST":
        print(123)
        message = request.form['message']
        message = message.strip()
        img = request.files['file'] 
        if img and len(message) != 0:
            filename = secure_filename(img.filename)
            # 圖片存 S3
            s3.upload_fileobj(img, BUCKET_NAME, 'image/' + filename)
            image_url = f'https://{CLOUDFRONT_PATH}/image/{filename}'
            print(image_url)
            # 圖片 CDN 網址、留言存 RDS
            try:
                connection_object = DB.rds_get_connection()
                mycursor = connection_object.cursor(dictionary=True)
                query = "INSERT INTO post (message, url) VALUES (%s, %s)"
                value = (message, image_url)
                mycursor.execute(query, value)
                connection_object.commit() 
                return jsonify({
                    "ok" : True
                })

            except mysql.connector.Error as err:
                print("error while insert to database: {}".format(err))
                return jsonify({
                    "error" : True,
                    "data" : "internal error"
                })

            finally:
                if DB.rds_get_connection().is_connected():
                    mycursor.close()
                    connection_object.close()
                pass
            
        else:
            return jsonify({
                    "error" : True,
                    "data" : "請輸入訊息並上傳圖片"
                })
    
    if request.method == "GET":
        try:
            connection_object = DB.rds_get_connection()
            mycursor = connection_object.cursor(dictionary=True)
            query = "SELECT * FROM post ORDER BY id DESC LIMIT 1"
            mycursor.execute(query)
            result = mycursor.fetchone()
            print(result)
            if result:
                return jsonify({
                    "ok" : True,
                    "data" : {
                        "message" : result['message'],
                        'url' : result['url']
                    }
                })
            return jsonify({
                "ok" : True,
                "data" : []
            })

        except mysql.connector.Error as err:
            print("error while insert to database: {}".format(err))
            return jsonify({
                "error" : True,
                "data" : "internal error"
            })

        finally:
            if DB.rds_get_connection().is_connected():
                mycursor.close()
                connection_object.close()
            
            

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 3000)