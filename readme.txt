On Linux :-

1. Install pip
	sudo apt install python-pip

2. Install and create a virtual environment
	python -m pip install --user virtualenv
	python -m virtualenv <directory_name>
	source <directory_name>/bin/activate

3. Go to the root folder of the extracted git repo and run requirements.txt
	pip install -r requirements.txt

4. Install mongodb server
	sudo apt install -y mongodb

5. Make sure the mongodb server is running
	sudo systemctl status mongodb

6. Run db.js script in the root folder of the extracted git repository
	mongo > applicationdb.js
	
7. Run the following commands from the root folder of the git repo to create user database
	python manage.py makemigrations
	python manage.py migrate

8. Start the django server by running the following from the root foler of the git repo
	python manage.py runserver

9. Server will start at http://127.0.0.1:8000/. Go to the link to access the application
