# This file provided by Facebook is for non-commercial testing and evaluation purposes only.
# Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import json
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='./')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/data.json', methods=['GET', 'POST'])
def comments_handler():

    with open('data.json', 'r') as file:
        comments = json.loads(file.read())

    if request.method == 'POST':
        newp = request.form.to_dict()
        newp["list"] = []
        #comments.prepend(newp)
        comments = [newp] + comments

        with open('data.json', 'w') as file:
            file.write(json.dumps(comments, indent=4, separators=(',', ': ')))

    return Response(json.dumps(comments), mimetype='application/json')

if __name__ == '__main__':
    app.run(port=3000)
