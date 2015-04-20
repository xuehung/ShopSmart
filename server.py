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
from datetime import timedelta
from flask import make_response, current_app
from functools import update_wrapper

app = Flask(__name__, static_url_path='', static_folder='./')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))




def crossdomain(origin=None, methods=None, headers=None, max_age=21600, attach_to_all=True, automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator



@app.route('/data.json', methods=['GET', 'POST'])
@crossdomain(origin='*')
def comments_handler():

    with open('data.json', 'r') as file:
        comments = json.loads(file.read())

    if request.method == 'POST':
        newp = request.form.to_dict()
        if newp['type'] == None:
            newp["list"] = []
            comments = [newp] + comments
        else:
            for i in comments:
                if i['id'] == newp['id']:
                    newc = {"name": newp['name'], "contact": newp['contact']}
                    print newc
                    i['list'].append(newc)

        with open('data.json', 'w') as file:
            file.write(json.dumps(comments, indent=4, separators=(',', ': ')))

    return Response(json.dumps(comments), mimetype='application/json')

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=3000)

