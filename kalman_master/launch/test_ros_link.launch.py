from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from ament_index_python import get_package_share_path


def generate_launch_description():
    return LaunchDescription(
        [
            Node(
                package="kalman_master",
                executable="master_loopback",
                parameters=[
                    {"loss_rate": 0.5},
                ],
            ),
            Node(
                package="kalman_master",
                executable="ros_link",
                name="ros_link_pc",
                parameters=[
                    {
                        "config_path": str(
                            get_package_share_path("kalman_master")
                            / "config/ros_link.yaml"
                        ),
                        "side": "pc",
                        "loopback_mangling": True,
                        "debug_info": False,
                    },
                ],
                output="screen",  # for debug print() statements
            ),
            Node(
                package="kalman_master",
                executable="ros_link",
                name="ros_link_gs",
                parameters=[
                    {
                        "config_path": str(
                            get_package_share_path("kalman_master")
                            / "config/ros_link.yaml"
                        ),
                        "side": "gs",
                        "loopback_mangling": True,
                        "debug_info": False,
                    },
                ],
                output="screen",
            ),
        ]
    )
