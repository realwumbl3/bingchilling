import os
import json
from datetime import datetime
from glob import glob

from zyXServe.Debug import PartTimer, PerfTimed, createLogger

from zyXServe.Server import (
    ApplyFlaskConfigs,
    app,
    request,
    session,
    redirect,
    url_for,
    g,  # it's g for grey
    clientAutoReload,
    buildPage,
    singleDirectoryWatcher,
    getBuild,
    renderBuild,
    render_template_path,
    SIO,
    join_room,
    leave_room,
    Compress,
    Cache,
)


logging = createLogger("server/log/app.log")


@app.route("/")
def _(*args):
    return bingChillingBackEnd.LEGACY()

@app.route("/new")
def _NEW(*args):
    return bingChillingBackEnd.NEW_GAME()


class BingChillingBackEnd:
    def __init__(self):
        pass

    def NEW_GAME(self):
        return renderBuild(
            getBuild(
                "bingchilling",
            ),
            data={
                "packs": [os.path.basename(x) for x in glob(f"./public/static/packs/*")],
            },
        )
        
    def LEGACY(self):
        return renderBuild(
            getBuild(
                "legacy",
            ),
            data={
                "packs": [os.path.basename(x) for x in glob(f"./public/static/packs/*")],
            },
        )


bingChillingBackEnd = BingChillingBackEnd()

buildPage("bingchilling")
buildPage("legacy")


@clientAutoReload.watch("frontend/bingchilling/")
def _():
    buildPage("bingchilling")
    clientAutoReload.remoteReload("bingchilling")
    
@clientAutoReload.watch("frontend/legacy/")
def _():
    buildPage("legacy")
    clientAutoReload.remoteReload("legacy")
