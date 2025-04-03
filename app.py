from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection function
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        database=os.environ.get('DB_NAME', 'ProjectSection'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', 'kavin'),
        port=os.environ.get('DB_PORT', '5432')
    )
    conn.autocommit = True
    return conn

# Create tables if they don't exist
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Projects table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Members table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS members (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            role VARCHAR(50) NOT NULL,
            avatar TEXT
        )
    ''')
    
    # Tasks table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            status VARCHAR(50) NOT NULL,
            assignee_id INTEGER REFERENCES members(id),
            due_date DATE,
            priority VARCHAR(50) NOT NULL,
            project_id INTEGER REFERENCES projects(id)
        )
    ''')
    
    # Documents table for collaborative editor content
    cur.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY,
            project_id INTEGER REFERENCES projects(id),
            text TEXT,
            code TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Add chat_messages table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id SERIAL PRIMARY KEY,
            document_id INTEGER REFERENCES documents(id),
            member_id INTEGER REFERENCES members(id),
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cur.close()
    conn.close()

# Initialize database
init_db()

# API Routes for Projects
@app.route('/api/projects', methods=['GET'])
def get_projects():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, title, description, created_at, updated_at FROM projects')
    projects = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([{
        'id': project[0],
        'title': project[1],
        'description': project[2],
        'createdAt': project[3].isoformat() if project[3] else None,
        'updatedAt': project[4].isoformat() if project[4] else None
    } for project in projects])

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, title, description, created_at, updated_at FROM projects WHERE id = %s', (project_id,))
    project = cur.fetchone()
    cur.close()
    conn.close()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify({
        'id': project[0],
        'title': project[1],
        'description': project[2],
        'createdAt': project[3].isoformat() if project[3] else None,
        'updatedAt': project[4].isoformat() if project[4] else None
    })

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        'INSERT INTO projects (title, description) VALUES (%s, %s) RETURNING id, created_at, updated_at',
        (data['title'], data.get('description', ''))
    )
    project_id, created_at, updated_at = cur.fetchone()
    
    # Create initial empty document for the project
    cur.execute(
        'INSERT INTO documents (project_id, text, code) VALUES (%s, %s, %s)',
        (project_id, '# Project Notes\n\nThis is a collaborative space for the team to share notes and ideas.', '// Example code')
    )
    
    cur.close()
    conn.close()
    
    return jsonify({
        'id': project_id,
        'title': data['title'],
        'description': data.get('description', ''),
        'createdAt': created_at.isoformat() if created_at else None,
        'updatedAt': updated_at.isoformat() if updated_at else None
    }), 201

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE projects SET title = %s, description = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING updated_at',
        (data['title'], data.get('description', ''), project_id)
    )
    
    updated_at = cur.fetchone()
    if not updated_at:
        cur.close()
        conn.close()
        return jsonify({'error': 'Project not found'}), 404
    
    cur.close()
    conn.close()
    
    return jsonify({
        'id': project_id,
        'title': data['title'],
        'description': data.get('description', ''),
        'updatedAt': updated_at[0].isoformat() if updated_at[0] else None
    })

# API Routes for Members
@app.route('/api/members', methods=['GET'])
def get_members():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name, email, role, avatar FROM members')
    members = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([{
        'id': member[0],
        'name': member[1],
        'email': member[2],
        'role': member[3],
        'avatar': member[4]
    } for member in members])

@app.route('/api/members', methods=['POST'])
def create_member():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            'INSERT INTO members (name, email, role, avatar) VALUES (%s, %s, %s, %s) RETURNING id',
            (data['name'], data['email'], data['role'], data.get('avatar'))
        )
        member_id = cur.fetchone()[0]
        cur.close()
        conn.close()
        
        return jsonify({
            'id': member_id,
            'name': data['name'],
            'email': data['email'],
            'role': data['role'],
            'avatar': data.get('avatar')
        }), 201
    except psycopg2.errors.UniqueViolation:
        cur.close()
        conn.close()
        return jsonify({'error': 'Email already exists'}), 400

@app.route('/api/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('DELETE FROM members WHERE id = %s RETURNING id', (member_id,))
    deleted = cur.fetchone()
    cur.close()
    conn.close()
    
    if not deleted:
        return jsonify({'error': 'Member not found'}), 404
    
    return jsonify({'message': 'Member deleted successfully'})

# API Routes for Tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        SELECT id, title, description, status, assignee_id, 
               due_date, priority, project_id
        FROM tasks
    ''')
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([{
        'id': task[0],
        'title': task[1],
        'description': task[2],
        'status': task[3],
        'assignee': str(task[4]) if task[4] else '',
        'dueDate': task[5].isoformat() if task[5] else None,
        'priority': task[6],
        'projectId': task[7]
    } for task in tasks])

# Replace the current create_task function with this fixed version

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Fix the assignee_id handling
    assignee_id = data.get('assignee')
    if assignee_id:
        # Check if it's already an integer
        if isinstance(assignee_id, int):
            pass  # Keep it as is
        elif isinstance(assignee_id, str) and assignee_id.strip():
            # Try to convert string to int
            try:
                assignee_id = int(assignee_id)
            except ValueError:
                assignee_id = None
        else:
            assignee_id = None
    else:
        assignee_id = None
    
    # Fix due_date handling
    due_date = data.get('dueDate')
    if due_date and isinstance(due_date, str) and due_date.strip():
        due_date = due_date
    else:
        due_date = None
    
    # Debug information
    print(f"Creating task with assignee_id: {assignee_id}, type: {type(assignee_id)}")
    
    cur.execute(
        '''INSERT INTO tasks (title, description, status, assignee_id, 
                             due_date, priority, project_id) 
           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id''',
        (data['title'], data.get('description', ''), data['status'], 
         assignee_id, due_date, data['priority'], 1)  # Default project_id = 1
    )
    
    task_id = cur.fetchone()[0]
    cur.close()
    conn.close()
    
    return jsonify({
        'id': task_id,
        'title': data['title'],
        'description': data.get('description', ''),
        'status': data['status'],
        'assignee': str(assignee_id) if assignee_id else '',
        'dueDate': due_date,
        'priority': data['priority']
    }), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE tasks SET status = %s WHERE id = %s RETURNING id',
        (data['status'], task_id)
    )
    
    updated = cur.fetchone()
    cur.close()
    conn.close()
    
    if not updated:
        return jsonify({'error': 'Task not found'}), 404
    
    return jsonify({'id': task_id, 'status': data['status']})

# API Routes for Documents
@app.route('/api/documents/<int:project_id>', methods=['GET'])
def get_document(project_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, text, code, updated_at FROM documents WHERE project_id = %s', (project_id,))
    document = cur.fetchone()
    cur.close()
    conn.close()
    
    if not document:
        return jsonify({'error': 'Document not found'}), 404
    
    return jsonify({
        'id': document[0],
        'text': document[1],
        'code': document[2],
        'updatedAt': document[3].isoformat() if document[3] else None
    })

@app.route('/api/documents/<int:project_id>', methods=['PUT'])
def update_document(project_id):
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        'UPDATE documents SET text = %s, code = %s, updated_at = CURRENT_TIMESTAMP WHERE project_id = %s RETURNING updated_at',
        (data['text'], data['code'], project_id)
    )
    
    updated = cur.fetchone()
    if not updated:
        cur.close()
        conn.close()
        return jsonify({'error': 'Document not found'}), 404
    
    cur.close()
    conn.close()
    
    return jsonify({
        'text': data['text'],
        'code': data['code'],
        'updatedAt': updated[0].isoformat() if updated[0] else None
    })

# Add these routes for chat messages
@app.route('/api/documents/<int:document_id>/messages', methods=['GET'])
def get_chat_messages(document_id):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Join with members table to get sender details
    cur.execute('''
        SELECT cm.id, cm.member_id, m.name, m.avatar, cm.message, cm.created_at
        FROM chat_messages cm
        JOIN members m ON cm.member_id = m.id
        WHERE cm.document_id = %s
        ORDER BY cm.created_at ASC
    ''', (document_id,))
    
    messages = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify([{
        'id': msg[0],
        'member_id': msg[1],
        'sender_name': msg[2],
        'sender_avatar': msg[3],
        'message': msg[4],
        'created_at': msg[5].isoformat() if msg[5] else None
    } for msg in messages])

@app.route('/api/documents/<int:document_id>/messages', methods=['POST'])
def create_chat_message(document_id):
    data = request.json
    
    if not data.get('member_id') or not data.get('message'):
        return jsonify({'error': 'Member ID and message are required'}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    # First check if document exists
    cur.execute('SELECT id FROM documents WHERE id = %s', (document_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({'error': 'Document not found'}), 404
    
    # Insert the message
    cur.execute(
        'INSERT INTO chat_messages (document_id, member_id, message) VALUES (%s, %s, %s) RETURNING id, created_at',
        (document_id, data['member_id'], data['message'])
    )
    
    message_id, created_at = cur.fetchone()
    
    # Get member info
    cur.execute('SELECT name, avatar FROM members WHERE id = %s', (data['member_id'],))
    member = cur.fetchone()
    
    conn.commit()
    cur.close()
    conn.close()
    
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    
    return jsonify({
        'id': message_id,
        'member_id': data['member_id'],
        'sender_name': member[0],
        'sender_avatar': member[1],
        'message': data['message'],
        'created_at': created_at.isoformat() if created_at else None
    }), 201

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
